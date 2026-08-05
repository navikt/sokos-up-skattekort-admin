import {BodyShort, Box, Skeleton, Table, VStack} from "@navikt/ds-react";
import type {BatchInsightRequest, Bestillingsbatch} from "./api/Bestillingsbatch";
import {type DateRange, toLocalDate, toLocalTime} from "../../util/dateUtils";
import SoekBatch from "./SoekBatch";
import {useLayoutEffect, useMemo, useRef, useState} from "react";
import JsonModal from "./JsonModal";
import {Tidslinjer} from "./Tidslinjer";
import {useFetchBatcher} from "./api/api";

type BatchCellRefs = Record<string, HTMLTableCellElement | null>;

export type BatchdetaljerProps = {
    dateRange: DateRange | null;
}

export default function Batchdetaljer({dateRange}: Readonly<BatchdetaljerProps>) {
    const [batchInsightRequest, setBatchInsightRequest] = useState<BatchInsightRequest | null>({
        tidspunktFom: dateRange?.from?.toISOString() ?? null,
        tidspunktTom: dateRange?.to?.toISOString() ?? null,
    });
    const [currentCell, setCurrentCell] = useState<HTMLTableCellElement | null>(null)
    useLayoutEffect(() => {
        currentCell?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
        });
    }, [currentCell])
    const {data, isLoading} = useFetchBatcher(batchInsightRequest);
    const batchRefs = useRef<BatchCellRefs>({});

    function scrollTo(bestillingsreferanse: string) {
        setCurrentCell(batchRefs.current[bestillingsreferanse])
    }

    const [batchTyper, setBatchTyper] = useState<string[]>(["OPPDATERING", "BESTILLING"])
    const [filters, setFilters] = useState<string[]>(["Ingen endringer"])

    const filteredBatches = useMemo(() => {
        const foo = data?.items
            .filter(batch => batchTyper.includes(batch.type))
            .filter(batch => (!batch.dataMottatt) || !(filters.includes("Ingen endringer")) || (showDataMottatt(batch) !== "Ingen endringer"))
            .filter(batch => !(filters.includes(batch.status)))
        return foo ?? [] as Bestillingsbatch[]
    }, [data, batchTyper, filters])

    return (
        <>
            <SoekBatch isLoading={isLoading} 
                       batchInsightRequestState={{value: batchInsightRequest, set: setBatchInsightRequest}}
                       filtersState={{value: filters, set: setFilters}}
                       batchTyperState={{value: batchTyper, set: setBatchTyper}}
            />
            <Box margin={"space-24"}>
                {isLoading && <Skeleton width="100%" height="200px"/>}
                {!isLoading && data?.items.length === 0 &&
                    <BodyShort>Ingen bestillingsbatcher funnet
                        fom {batchInsightRequest?.tidspunktFom} {batchInsightRequest?.tidspunktTom ? `tom ${batchInsightRequest?.tidspunktTom}` : ""}</BodyShort>}
                {!isLoading && filteredBatches && filteredBatches.length > 0 &&

                    <Box
                        padding={"space-8"}
                        background={"surface-default"}
                        borderWidth="2"
                        borderRadius="12"
                    >
                        <Tidslinjer batcher={filteredBatches} handleScrollTo={scrollTo}/>
                        <div style={{
                            height: "1000px",
                            overflowY: "scroll",
                            overflowX: "hidden"
                        }}>
                            <Table zebraStripes stickyHeader>
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
                                    {filteredBatches.map((batch) => (
                                        <Table.Row key={batch.bestillingsreferanse}>
                                            <Table.DataCell
                                                ref={(cell) => {
                                                    batchRefs.current[batch.bestillingsreferanse] = cell;
                                                }}
                                            >{batch.bestillingsreferanse}</Table.DataCell>
                                            <Table.DataCell>{batch.status}</Table.DataCell>
                                            <Table.DataCell>{batch.type}</Table.DataCell>
                                            <Table.DataCell><VStack><BodyShort>{toLocalDate(batch.opprettet)}</BodyShort><BodyShort>{toLocalTime(batch.opprettet)}</BodyShort></VStack></Table.DataCell>
                                            <Table.DataCell><VStack><BodyShort>{toLocalDate(batch.oppdatert)}</BodyShort><BodyShort>{toLocalTime(batch.oppdatert)}</BodyShort></VStack></Table.DataCell>
                                            <Table.DataCell>
                                                <JsonModal hva={"Fullt request"} shortText={showDataSendt(batch)}
                                                           text={batch.dataSendt}/>
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                <JsonModal hva={"Fullt response"} shortText={showDataMottatt(batch)}
                                                           text={batch.dataMottatt}/>
                                            </Table.DataCell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </Box>
                }
            </Box>
        </>
    )
}

function showDataSendt(batch: Bestillingsbatch) {
    const dataSendt = batch.dataSendt ? JSON.parse(batch.dataSendt) : null;
    const arbeidstakere = dataSendt?.forespoerselOmSkattekortTilArbeidsgiver?.arbeidsgiver[0]?.arbeidstakeridentifikator
    if (batch.type === "OPPDATERING") return "Det vanlige Oppdateringsrequestet"
    if (arbeidstakere.length < 5) return `Request(${dataSendt.inntektsaar}, ${arbeidstakere.join(",")})`
    return `Request for ${dataSendt.inntektsaar}, ${arbeidstakere.length} personer)`;
}

function showDataMottatt(batch: Bestillingsbatch) {
    const dataMottatt = batch.dataMottatt ? JSON.parse(batch.dataMottatt) : null
    if (!dataMottatt) return ""
    if (dataMottatt.status === "INGEN_ENDRINGER") return "Ingen endringer"
    // @ts-expect-error - kanskje legge inn typer på data mottatt senere
    const arbeidstakere = dataMottatt?.arbeidsgiver[0]?.arbeidstaker.map(a => a.arbeidstakeridentifikator)
    if (arbeidstakere.length < 5) return `Skattekort for ${arbeidstakere.join(",")}`
    return `Skattekort for ${arbeidstakere.length} personer`
}