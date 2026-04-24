import {BodyShort, Box, ExpansionCard, Skeleton, Table, VStack} from "@navikt/ds-react";
import {useFetchBatcher} from "../api/apiService";
import type {BatchInsightRequest, Bestillingsbatch} from "../types/Bestillingsbatch";
import {toLocalDate, toLocalTime} from "../util/dateUtils";
import SoekBatch from "../components/SoekBatch";
import {useLayoutEffect, useRef, useState} from "react";
import JsonModal from "../components/JsonModal";
import {Tidslinjer} from "../components/Tidslinjer";

type BatchCellRefs = Record<string, HTMLTableCellElement | null>;

export default function Batchdetaljer() {
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

    const batchRefs = useRef<BatchCellRefs>({});

    function scrollTo(bestillingsreferanse: string) {
        setCurrentCell(batchRefs.current[bestillingsreferanse])
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
                    <Tidslinjer batcher={data.items} handleScrollTo={scrollTo}/>
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
    const dataSendt = batch.dataSendt ? JSON.parse(batch.dataSendt) : null;
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