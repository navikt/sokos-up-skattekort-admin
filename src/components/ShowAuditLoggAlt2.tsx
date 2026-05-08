import {Box, Process, VStack} from "@navikt/ds-react";
import {useFetchAuditLogg} from "../api/apiService";
import type {Audit} from "../types/Audit";
import type {Skattekort} from "../types/SkattekortResponseDTOSchema";
import {groupByDate, Periode} from "../util/listUtils";
import VisSkattekort from "./VisSkattekort";
import VisAuditLogg from "./VisAuditLogg";
import {toLocalDate} from "../util/dateUtils";

type ShowAuditLoggProps = {
    fnr: string;
    jumpToBatches: (date: Date) => void;
    skattekort: Skattekort[];
}

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
function isAnAudit(periode: Periode<any>): periode is Periode<Audit> {
    return !!periode.item.informasjon
}

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
function isASkattekort(periode: Periode<any>): periode is Periode<Skattekort> {
    return !!periode.item.resultatForSkattekort
}

export default function ShowAuditLoggAlt2({fnr, jumpToBatches, skattekort}: Readonly<ShowAuditLoggProps>) {
    const {data, error, isLoading} = useFetchAuditLogg(fnr)
    
    const skattekortPerioder = skattekort.map(skattekort => new Periode(skattekort, new Date(skattekort.opprettet), undefined))
    const auditPerioder = data?.items.map(audit => new Periode(audit, new Date(audit.opprettet), undefined)) ?? []

    const events = data ? 
        Object.entries(groupByDate<Skattekort | Audit>([...skattekortPerioder, ...auditPerioder]))
        .toSorted(([a],[b]) => new Date(a).getTime() - new Date(b).getTime()) : null;
    
    const esah = [
        ...(events?.map(([dato, perioder]) => (
            <Process.Event
                key={dato} 
                title={toLocalDate(dato)}>
                {perioder.toSorted((a, b) => a.fom.getTime() - b.fom.getTime())
                    .map(hendelse => {
                        if (isASkattekort(hendelse)) {
                            return (
                                <Box key={hendelse.item.identifikator} margin={"space-8"}>
                                    <VisSkattekort skattekort={hendelse.item} jumpToBatches={jumpToBatches}/>
                                </Box>
                            )
                        }
                        if (isAnAudit(hendelse)) {
                            return (
                                <VisAuditLogg key={hendelse.item.id} auditLogg={hendelse.item} jumpToBatches={jumpToBatches}/>
                            )
                        }

                        return JSON.stringify(hendelse.item)
                    })}
            </Process.Event>
        )) ?? []),
    ];
    
    return (
        <VStack padding="space-8" gap="space-16">
            <Process>{esah}</Process>
        </VStack>)
}