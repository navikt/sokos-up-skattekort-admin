import type {Bestillingsbatch} from "../types/Bestillingsbatch";
import {Box, Timeline} from "@navikt/ds-react";
import {ClockDashedIcon, PaperplaneIcon} from "@navikt/aksel-icons";
import {isMoreThan24HoursBetween, now, toLocalDate} from "../util/dateUtils";

export type TidslinjerProps = {
    batcher: Bestillingsbatch[];
    handleScrollTo: (bestillingsreferanse: string) => void;
}

function groupByDay(batcher: Bestillingsbatch[]) {
    const byDay: Record<string, Bestillingsbatch[]> = {};
    for (const curr of batcher) {
        const dato = new Date(curr.opprettet).toISOString().substring(0, 10);
        if (!byDay[dato]) {
            byDay[dato] = [];
        }
        byDay[dato].push(curr);
    }
    return byDay;
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
    
    return (<>
        {earliestBatch && latestBatch && isMoreThan24HoursBetween(earliestBatch, latestBatch) &&
        <Box marginInline="auto" maxWidth="800px">
            <Timeline startDate={earliestBatch} endDate={latestBatch}>
                <Timeline.Row label={"Bestillinger"} icon={<PaperplaneIcon aria-hidden/>}>
                    {Object.entries(groupByDay(batcher.filter(it => it.type === "BESTILLING")))
                        .map(([dato, bbs]) => (
                            <Timeline.Period
                                key={bbs[0].id} start={new Date(dato)} end={new Date(dato)}
                                status={bbs.some((bb:Bestillingsbatch) => bb.status === "FEILET") ? "danger" : "info"}
                                onClick={() => handleScrollTo(bbs[0].bestillingsreferanse)}
                            >
                                Bestilt fra Skatteetaten {toLocalDate(dato)}
                            </Timeline.Period>
                        ))}
                </Timeline.Row>
                <Timeline.Row label={"Oppdateringer"} icon={<ClockDashedIcon aria-hidden/>}>
                    {Object.entries(groupByDay(batcher.filter(it => it.type === "OPPDATERING")))
                        .map(([dato, bbs]) => (
                            <Timeline.Period
                                key={bbs[0].id} start={new Date(dato)} end={new Date(dato)}
                                status={bbs.some((bb:Bestillingsbatch) => bb.status === "FEILET") ? "danger" : "info"}
                                onClick={() => handleScrollTo(bbs[0].bestillingsreferanse)}
                            >
                                Bestilt fra Skatteetaten {toLocalDate(dato)}
                            </Timeline.Period>
                        ))}
                </Timeline.Row>
            </Timeline>
        </Box>}
    </>)
}
