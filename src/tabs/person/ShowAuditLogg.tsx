import {BodyLong, BodyShort, Box, Button, ExpansionCard, HStack, Process, VStack} from "@navikt/ds-react";
import {useFetchAuditLogg} from "./api/api";
import type {Audit} from "./api/Audit";
import {type Skattekort, skattekortTittel} from "./api/SkattekortResponseDTOSchema";
import {groupByDate, Periode} from "../../util/listUtils";
import {toLocalDate, toLocalDateTime} from "../../util/dateUtils";
import Skattekortdata from "./Skattekortdata";
import Errorhandler from "../../common/Errorhandler";
import {ikon, isAnAudit, isASkattekort} from "../../util/auditUtils";

type ShowAuditLoggProps = {
    fnr: string;
    jumpToBatches: (date: Date) => void;
    skattekort?: Skattekort[];
    refreshRate: number;
}

export default function ShowAuditLogg({fnr, refreshRate, jumpToBatches, skattekort}: Readonly<ShowAuditLoggProps>) {
    const {data: auditData, error} = useFetchAuditLogg(fnr, refreshRate)

    const skattekortPerioder =
        skattekort?.map(skattekort => new Periode(skattekort, new Date(skattekort.opprettet), undefined)) ?? []
    const auditPerioder =
        auditData?.items?.map(audit => new Periode(audit, new Date(audit.opprettet), undefined)) ?? []

    const events = auditData ?
        Object.entries(groupByDate<Skattekort | Audit>([...skattekortPerioder, ...auditPerioder]))
            .toSorted(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) : null;

    const esah = [
        ...(events?.map(([dato, perioder], index) => {
            const dagensHendelser = perioder.toSorted((a, b) => a.fom.getTime() - b.fom.getTime());
            const dagensIcons = dagensHendelser.map(hendelse => ikon(hendelse, dato))
            return (<ExpansionCard defaultOpen={index === 0} aria-label={`Hendelser for ${dato}`} key={dato}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h4" size="small">
                            <HStack gap="space-8">{toLocalDate(dato)}, {dagensIcons.length} hendelser: {dagensIcons}</HStack>
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <Process.Event
                            key={dato}
                            title={toLocalDate(dato)}>
                            {dagensHendelser
                                .map(hendelse => {
                                    if (isASkattekort(hendelse)) {
                                        const skattekort = hendelse.item
                                        return (
                                            <Box key={`skattekort${hendelse.item.id}`} margin={"space-8"}
                                                 width={"768px"}>
                                                <ExpansionCard defaultOpen={!!open} aria-label="Skattekort">
                                                    <ExpansionCard.Header>
                                                        <ExpansionCard.Title as="h4" size="small">
                                                            {skattekortTittel(skattekort)} {skattekort.inntektsaar}.{" "}
                                                            {(skattekort.utstedtDato ?? "") !== "" &&
                                                                `Utstedt ${toLocalDate(skattekort.utstedtDato ?? "")}`}
                                                        </ExpansionCard.Title>
                                                    </ExpansionCard.Header>
                                                    <ExpansionCard.Content>
                                                        <Skattekortdata skattekort={skattekort} jumpToBatches={jumpToBatches}/>
                                                    </ExpansionCard.Content>
                                                </ExpansionCard>
                                            </Box>
                                        )
                                    }
                                    if (isAnAudit(hendelse)) {
                                        const auditLogg = hendelse.item
                                        return (
                                            <Box key={auditLogg.id}
                                                 background={"surface-default"}
                                                 paddingInline={"space-8"}
                                                 margin={"space-2"}
                                                 borderRadius="large">
                                                <HStack align={"center"} wrap={false} gap={"space-32"}>
                                                    <HStack align={"center"} wrap={false} gap="space-8" justify={"space-evenly"}>
                                                        <BodyShort> {auditLogg.brukerId} </BodyShort>
                                                        <Button variant={"tertiary-neutral"}
                                                                style={{whiteSpace: "nowrap"}}
                                                                onClick={() => jumpToBatches(new Date(auditLogg.opprettet))}> {toLocalDateTime(auditLogg.opprettet)}</Button>
                                                    </HStack>
                                                    <BodyLong><b>{auditLogg.tag}({ikon(hendelse, dato)}):</b> {auditLogg.informasjon}
                                                    </BodyLong>
                                                </HStack>
                                            </Box>)
                                    }

                                    return JSON.stringify(hendelse.item)
                                })}
                        </Process.Event>
                    </ExpansionCard.Content>
                </ExpansionCard>
            )
        }) ?? []),
    ];

    return (
        <VStack padding="space-8" gap="space-16">
            <Errorhandler fetchSubject={"auditlogg"} error={error} emptyResponse={!events || events.length === 0}/>
            <Process>{esah}</Process>
        </VStack>)
}