import {BodyShort, Box, Button, ExpansionCard, Heading, Skeleton, Table, Timeline, VStack} from "@navikt/ds-react";
import {useFetchBatcher} from "../api/apiService";
import type {BatchInsightRequest, Bestillingsbatch} from "../types/Bestillingsbatch";
import {
    isMoreThan24HoursBetween,
    now,
    toLocalDate,
    toLocalTime
} from "../util/dateUtils";
import SoekBatch from "./SoekBatch";
import {useState} from "react";
import {PersonIcon} from "@navikt/aksel-icons";

export default function GenerellInformasjon() {
    const [batchInsightRequest, setBatchInsightRequest] = useState<BatchInsightRequest | null>({});

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

    return (
        <Box margin={"space-24"}>
            <Heading size={"medium"} spacing>Generell informasjon</Heading>
            <SoekBatch isLoading={isLoading} batchInsightRequest={batchInsightRequest}
                       handleBatchInsightRequest={setBatchInsightRequest}/>
            {isLoading && <Skeleton width="100%" height="200px"/>}
            {!isLoading && data && data.items.length > 0 &&
                <>
                    { earliestBatch && latestBatch && isMoreThan24HoursBetween(earliestBatch, latestBatch) &&
                        <Box marginInline="auto" maxWidth="800px">
                            <Timeline startDate={earliestBatch} endDate={latestBatch}>
                                <Timeline.Row label="Tidslinje" icon={<PersonIcon aria-hidden/>}>
                                    {data.items.map((p) => (
                                        <Timeline.Period
                                            key={p.id}
                                            start={new Date(p.opprettet)}
                                            end={new Date(p.opprettet)}
                                            status={"success"}
                                            icon={<PersonIcon aria-hidden/>}
                                            statusLabel={"foo"}
                                        >
                                            Hello this is period.
                                        </Timeline.Period>
                                    ))}
                                </Timeline.Row>
                            </Timeline>
                        </Box>}
                    <ExpansionCard defaultOpen aria-label="Bestillingsbatcher">
                        <ExpansionCard.Header>
                            <ExpansionCard.Title>Bestillingsbatcher</ExpansionCard.Title>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <div style={{height: "600px", overflow: "scroll"}}>
                                <Table zebraStripes>
                                    <TableHeaders/>
                                    <Batches batches={data.items}/>
                                </Table>
                            </div>
                        </ExpansionCard.Content>
                    </ExpansionCard>
                </>
            }
        </Box>)
}

function TableHeaders() {
    return (<Table.Header>
        <Table.Row>
            <Table.HeaderCell scope="col">Ref</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Oppdatert</Table.HeaderCell>
            <Table.HeaderCell scope="col">Data sendt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Data mottatt</Table.HeaderCell>
        </Table.Row>
    </Table.Header>)
}

type BatchesProps = {
    batches: Bestillingsbatch[]
}

function Batches({batches}: Readonly<BatchesProps>) {
    return (
        <Table.Body>
            {batches.map((item) => (
                <TableRow key={item.id} item={item}/>
            ))}
        </Table.Body>)
}

function TableRow({item}: Readonly<{ item: Bestillingsbatch }>) {
    function showDataSendt(batch: Bestillingsbatch, showFullRequest: number) {
        const dataSendt = JSON.parse(batch.dataSendt);
        const arbeidstakere = dataSendt?.forespoerselOmSkattekortTilArbeidsgiver?.arbeidsgiver[0]?.arbeidstakeridentifikator?.join(", ")

        if (showFullRequest > 0) {
            return JSON.stringify(dataSendt, null, 2)
        }
        let text: string;
        if (batch.type === "OPPDATERING") text = "Det vanlige Oppdateringsrequestet"
        else text = `Request(${dataSendt.inntektsaar}, ${arbeidstakere})`;
        return <Button variant="tertiary-neutral">{text}</Button>
    }

    function showDataMottatt(batch: Bestillingsbatch, showFullResponse: number) {
        const dataMottatt = batch.dataMottatt ? JSON.parse(batch.dataMottatt) : null

        if (showFullResponse || (dataMottatt == null) || dataMottatt.status === "INGEN_ENDRINGER") return JSON.stringify(dataMottatt, null, 2)


        // @ts-expect-error - kanskje jeg legger inn type på data mottatt senere
        const arbeidstakere = dataMottatt?.arbeidsgiver[0]?.arbeidstaker.map(a => a.arbeidstakeridentifikator)
        let text: string;
        if (arbeidstakere.length < 5) text = `Skattekort for ${arbeidstakere.join(",")}`
        else text = `Skattekort for ${arbeidstakere.length} personer`

        return <Button variant="tertiary-neutral">{text}</Button>

    }

    const [showFullRequest, setShowFullRequest] = useState<number>(0)
    const [showFullResponse, setShowFullResponse] = useState<number>(0)

    return <Table.Row key={item.id}>
        <Table.DataCell>{item.bestillingsreferanse}</Table.DataCell>
        <Table.DataCell>{item.status}</Table.DataCell>
        <Table.DataCell>{item.type}</Table.DataCell>
        <Table.DataCell><VStack><BodyShort>{toLocalDate(item.opprettet)}</BodyShort><BodyShort>{toLocalTime(item.opprettet)}</BodyShort></VStack></Table.DataCell>
        <Table.DataCell><VStack><BodyShort>{toLocalDate(item.oppdatert)}</BodyShort><BodyShort>{toLocalTime(item.oppdatert)}</BodyShort></VStack></Table.DataCell>
        <Table.DataCell onClick={() => {
            setShowFullRequest((showFullRequest + 1) % 3)
        }}>{showDataSendt(item, showFullRequest)}</Table.DataCell>
        <Table.DataCell onClick={() => {
            setShowFullResponse((showFullResponse + 1) % 3)
        }}>{showDataMottatt(item, showFullResponse)}</Table.DataCell>
    </Table.Row>
}