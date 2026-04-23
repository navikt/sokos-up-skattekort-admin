import {BodyShort, Box, ExpansionCard, Skeleton, Table, Timeline, VStack} from "@navikt/ds-react";
import {useFetchBatcher} from "../api/apiService";
import type {BatchInsightRequest, Bestillingsbatch} from "../types/Bestillingsbatch";
import {isMoreThan24HoursBetween, now, toLocalDate, toLocalTime} from "../util/dateUtils";
import SoekBatch from "../components/SoekBatch";
import {useLayoutEffect, useRef, useState} from "react";
import {ClockDashedIcon, PaperplaneIcon} from "@navikt/aksel-icons";
import JsonModal from "../components/JsonModal";

type BatchCellRefs = Record<string, HTMLTableCellElement | null>;

export default function Batcher() {
    const [batchInsightRequest, setBatchInsightRequest] = useState<BatchInsightRequest | null>({
        tidspunktFom: null,
        tidspunktTom: null
    });
    const [currentCell, setCurrentCell] = useState<HTMLTableCellElement | null>(null)
    useLayoutEffect(() => {
        currentCell?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
        });
    }, [currentCell])
    const {data, error, isLoading} = useFetchBatcher(batchInsightRequest);

    const earliestBatch = data?.items.length === 0 ? null : data?.items
        .reduce((earliest, batch) => {
                const opprettet = new Date(batch.opprettet)
                if (opprettet < earliest) return opprettet; else return earliest;
            }, now()
        )

    const latestBatch = data?.items.length === 0 ? null : data?.items.reduce((latest, batch) => {
            const oppdatert = new Date(batch.oppdatert)
            if (oppdatert > latest) return oppdatert; else return latest;
        }, new Date("1970-01-01")
    )

    const batchRefs = useRef<BatchCellRefs>({});

    function getTidslinje(title: string, batcher: Bestillingsbatch[]) {
        if (batcher.length === 0) {
            return (<></>)
        }
        return <Timeline.Row label={title} icon={batcher[0].type === "BESTILLING" ? <PaperplaneIcon aria-hidden/> : <ClockDashedIcon aria-hidden/>}>
            {batcher.map((p) => (
                <Timeline.Period
                    key={p.id}
                    start={new Date(p.opprettet)}
                    end={new Date(p.opprettet)}
                    status={p.status === "FERDIG" ? "success"
                        : p.status === "FEILET" ? "danger"
                            : "info"}
                    onClick={() => setCurrentCell(batchRefs.current[p.bestillingsreferanse])}
                >
                    Bestilt fra Skatteetaten {toLocalDate(p.opprettet)}
                </Timeline.Period>

            ))}
        </Timeline.Row>;
    }

    return (
        <Box margin={"space-24"}>
            <SoekBatch isLoading={isLoading} batchInsightRequest={batchInsightRequest}
                       handleBatchInsightRequest={setBatchInsightRequest}/>
            {isLoading && <Skeleton width="100%" height="200px"/>}
            {!isLoading && data?.items.length === 0 &&
                <BodyShort>Ingen bestillingsbatcher funnet
                    fom {batchInsightRequest?.tidspunktFom} {batchInsightRequest?.tidspunktTom ? "tom {batchInsightRequest?.tidspunktTom}" : ""}</BodyShort>}
            {!isLoading && data && data.items.length > 0 &&
                <>
                    {earliestBatch && latestBatch && isMoreThan24HoursBetween(earliestBatch, latestBatch) &&
                        <Box marginInline="auto" maxWidth="800px">
                            <Timeline startDate={earliestBatch} endDate={latestBatch}>
                                {getTidslinje("Bestillinger", data.items.filter(it => it.type === "BESTILLING"))}
                                {getTidslinje("Oppdateringer", data.items.filter(it => it.type === "OPPDATERING"))}
                            </Timeline>
                        </Box>}
                    <ExpansionCard defaultOpen aria-label="Bestillingsbatcher">
                        <ExpansionCard.Header>
                            <ExpansionCard.Title>Bestillingsbatcher</ExpansionCard.Title>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <div style={{height: "600px", overflowY: "scroll", overflowX: "hidden"}}>
                                <Table zebraStripes>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell scope="col">Ref</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Oppdatert</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Data sendt</Table.HeaderCell>
                                            <Table.HeaderCell scope="col">Data mottatt</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {data.items.map((item) => (
                                            <Table.Row key={item.bestillingsreferanse}>
                                                <Table.DataCell
                                                    ref={(cell) => {
                                                        batchRefs.current[item.bestillingsreferanse] = cell;
                                                    }}
                                                >{item.bestillingsreferanse}</Table.DataCell>
                                                <Table.DataCell>{item.status}</Table.DataCell>
                                                <Table.DataCell>{item.type}</Table.DataCell>
                                                <Table.DataCell><VStack><BodyShort>{toLocalDate(item.opprettet)}</BodyShort><BodyShort>{toLocalTime(item.opprettet)}</BodyShort></VStack></Table.DataCell>
                                                <Table.DataCell><VStack><BodyShort>{toLocalDate(item.oppdatert)}</BodyShort><BodyShort>{toLocalTime(item.oppdatert)}</BodyShort></VStack></Table.DataCell>
                                                <Table.DataCell>
                                                    <JsonModal hva={"Fullt request"} shortText={showDataSendt(item)}
                                                               text={item.dataSendt}/>
                                                </Table.DataCell>
                                                <Table.DataCell>
                                                    <JsonModal hva={"Fullt response"} shortText={showDataMottatt(item)}
                                                               text={item.dataMottatt}/>
                                                </Table.DataCell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </ExpansionCard.Content>
                    </ExpansionCard>
                </>
            }
        </Box>)
}

function showDataSendt(batch: Bestillingsbatch) {
    const dataSendt = JSON.parse(batch.dataSendt);
    const arbeidstakere = dataSendt?.forespoerselOmSkattekortTilArbeidsgiver?.arbeidsgiver[0]?.arbeidstakeridentifikator?.join(", ")
    if (batch.type === "OPPDATERING") return "Det vanlige Oppdateringsrequestet"
    return `Request(${dataSendt.inntektsaar}, ${arbeidstakere})`;
}

function showDataMottatt(batch: Bestillingsbatch) {
    const dataMottatt = batch.dataMottatt ? JSON.parse(batch.dataMottatt) : null
    if (!dataMottatt) return ""
    if (dataMottatt.status === "INGEN_ENDRINGER") return "Ingen endringer"
    // @ts-expect-error - kanskje legge inn type på data mottatt senere
    const arbeidstakere = dataMottatt?.arbeidsgiver[0]?.arbeidstaker.map(a => a.arbeidstakeridentifikator)
    if (arbeidstakere.length < 5) return `Skattekort for ${arbeidstakere.join(",")}`
    return `Skattekort for ${arbeidstakere.length} personer`
}