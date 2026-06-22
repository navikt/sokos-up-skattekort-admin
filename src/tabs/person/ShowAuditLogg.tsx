import {BodyLong, BodyShort, Box, Button, ExpansionCard, HStack, Process, VStack} from "@navikt/ds-react";
import {useFetchAuditLogg} from "./api/api";
import {type Audit, AuditSchema} from "./api/Audit";
import {type Skattekort, SkattekortResponseDTOSchema, skattekortTittel} from "./api/SkattekortResponseDTOSchema";
import {groupByDate, Periode} from "../../util/listUtils";
import {toLocalDate, toLocalDateTime} from "../../util/dateUtils";
import Skattekortdata from "./Skattekortdata";
import Errorhandler from "../../common/Errorhandler";

type ShowAuditLoggProps = {
    fnr: string;
    jumpToBatches: (date: Date) => void;
    skattekort?: Skattekort[];
    shouldRefresh: boolean;
}

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
function isAnAudit(periode: Periode<any>): periode is Periode<Audit> {
    return AuditSchema.safeParse(periode.item).success
}

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
function isASkattekort(periode: Periode<any>): periode is Periode<Skattekort> {
    return SkattekortResponseDTOSchema.safeParse(periode.item).success
}

export default function ShowAuditLogg({fnr, shouldRefresh, jumpToBatches, skattekort}: Readonly<ShowAuditLoggProps>) {
    const {data: auditData, error} = useFetchAuditLogg(fnr, shouldRefresh)

    const skattekortPerioder =
        skattekort?.map(skattekort => new Periode(skattekort, new Date(skattekort.opprettet), undefined)) ?? []
    const auditPerioder =
        auditData?.items?.map(audit => new Periode(audit, new Date(audit.opprettet), undefined)) ?? []

    const events = auditData ?
        Object.entries(groupByDate<Skattekort | Audit>([...skattekortPerioder, ...auditPerioder]))
            .toSorted(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) : null;

    const esah = [
        ...(events?.map(([dato, perioder]) => (
            <Process.Event
                key={dato}
                title={toLocalDate(dato)}>
                {perioder.toSorted((a, b) => a.fom.getTime() - b.fom.getTime())
                    .map(hendelse => {
                        if (isASkattekort(hendelse)) {
                            const skattekort = hendelse.item
                            return (
                                <Box key={`skattekort${hendelse.item.id}`} margin={"space-8"} width={"768px"}>
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
                                                    style={{ whiteSpace: "nowrap" }}
                                                    onClick={() => jumpToBatches(new Date(auditLogg.opprettet))}> {toLocalDateTime(auditLogg.opprettet)}</Button>
                                        </HStack>
                                        <BodyLong><b>{auditLogg.tag}:</b> {auditLogg.informasjon}</BodyLong>
                                    </HStack>
                                </Box>)
                        }

                        return JSON.stringify(hendelse.item)
                    })}
            </Process.Event>
        )) ?? []),
    ];

    return (
        <VStack padding="space-8" gap="space-16">
            <Errorhandler heading={"Feil ved henting av auditlogg"} error={error} emptyResponse={!events || events.length === 0} />
            <Process>{esah}</Process>
        </VStack>)
}