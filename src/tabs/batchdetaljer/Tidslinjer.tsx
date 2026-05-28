import type {Bestillingsbatch} from "./api/Bestillingsbatch";
import {Box, Timeline} from "@navikt/ds-react";
import {ClockDashedIcon, PaperplaneIcon} from "@navikt/aksel-icons";
import {isMoreThan24HoursBetween, now, toLocalDate} from "../../util/dateUtils";
import {groupByDay} from "../../util/listUtils";

export type TidslinjerProps = {
    batcher: Bestillingsbatch[];
    handleScrollTo: (bestillingsreferanse: string) => void;
}

export function Tidslinjer({batcher, handleScrollTo}: Readonly<TidslinjerProps>) {
    const earliestBatch = batcher.length === 0 ? null : batcher
        .reduce((earliest, batch) => {
                const opprettet = new Date(batch.opprettet)
                if (opprettet < earliest) return opprettet; else return earliest;
            }, now()
        )
    
    const latestBatch = batcher.length === 0 ? null : batcher.reduce((latest, batch) => {
            const oppdatert = new Date(batch.oppdatert)
            if (oppdatert > latest) return oppdatert; else return latest;
        }, new Date("1970-01-01")
    )

    let bestillingerByDay = Object.entries(groupByDay(batcher.filter(it => it.type === "BESTILLING")));
    let oppdateringerByDay = Object.entries(groupByDay(batcher.filter(it => it.type === "OPPDATERING")));
    return (<>
        {earliestBatch && latestBatch && isMoreThan24HoursBetween(earliestBatch, latestBatch) && (bestillingerByDay.length > 0 || oppdateringerByDay.length > 0) && 
        <Box marginInline="auto" minWidth={"1024px"}>
            <Timeline startDate={earliestBatch} endDate={latestBatch}>
                {bestillingerByDay.length > 0 && <Timeline.Row label={"Bestillinger"} icon={<PaperplaneIcon aria-hidden/>}>
                    {bestillingerByDay
                        .map(([dato, bbs]) => (
                            <Timeline.Period
                                key={bbs[0].id} start={new Date(dato)} end={new Date(dato)}
                                status={bbs.some((bb:Bestillingsbatch) => bb.status === "FEILET") ? "danger" : "info"}
                                onClick={() => handleScrollTo(bbs[0].bestillingsreferanse)}
                            >
                                Bestilt fra Skatteetaten {toLocalDate(dato)}
                            </Timeline.Period>
                        ))}
                </Timeline.Row>}
                {oppdateringerByDay.length > 0 && <Timeline.Row label={"Oppdateringer"} icon={<ClockDashedIcon aria-hidden/>}>
                    {oppdateringerByDay
                        .map(([dato, bbs]) => (
                            <Timeline.Period
                                key={bbs[0].id} start={new Date(dato)} end={new Date(dato)}
                                status={bbs.some((bb:Bestillingsbatch) => bb.status === "FEILET") ? "danger" : "info"}
                                onClick={() => handleScrollTo(bbs[0].bestillingsreferanse)}
                            >
                                Bestilt fra Skatteetaten {toLocalDate(dato)}
                            </Timeline.Period>
                        ))}
                </Timeline.Row>}
            </Timeline>
        </Box>}
    </>)
}
