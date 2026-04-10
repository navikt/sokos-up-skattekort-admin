import {BodyShort, Box, Heading, Table, TextField, Timeline, Tooltip, VStack} from "@navikt/ds-react";
import {useFetchBatcher} from "../api/apiService";
import {BatchInsightResponse, Bestillingsbatch} from "../types/Bestillingsbatch";
import {toLocalDate, toLocalTime} from "../util/norskFormat";
import {ArrowCirclepathIcon} from "@navikt/aksel-icons";
import {useState} from "react";

export default function GenerellInformasjon() {
    return (<Box margin={"space-24"}>
        <Heading size={"medium"} spacing>Generell informasjon</Heading>
        <ShowBatches/>
    </Box>)
}

type ShowBatchesProps = {
    data: BatchInsightResponse
}

function ShowBatches() {
    const [datoFom, setDatoFom] = useState<string>("")
    const [datoTom, setDatoTom] = useState<string>("")
    const {data, error, isLoading} = useFetchBatcher(datoFom, datoTom)

    return (<>
        {data && <Box marginInline="auto" maxWidth="800px">
                <Timeline>
                    <Timeline.Row label="" icon={<ArrowCirclepathIcon title="a11y-title" fontSize="1.5rem"/>}>
                        {data.items.slice(-5).map((item) => (
                            <Timeline.Period
                                key={item.id}
                                start={new Date(item.opprettet)}
                                end={new Date(item.oppdatert)}
                                status={"info"}
                            >
                                <Tooltip key={item.id} content={"test"}>
                                    <Table>
                                        <TableHeaders/>
                                        <Batches batches={[item]}/>
                                    </Table>
                                </Tooltip>
                            </Timeline.Period>
                        ))}
                    </Timeline.Row>
                </Timeline>
            </Box>}
            <Box> 
                <TextField label={"DatoFOM"} value={datoFom} onChange={(e) => setDatoFom(e.target.value)}/>
                <TextField label={"DatoTOM"} value={datoTom} onChange={(e) => setDatoTom(e.target.value)}/>
            </Box>
        {data && <Table zebraStripes>
                <TableHeaders/>
                {data.items && <Batches batches={data.items}/>}
            </Table>}
        </>
    )
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
    return (<Table.Body>
        {batches.slice(0, 5).map((item) => (
            <Table.Row key={item.id}>
                <Table.DataCell>{item.bestillingsreferanse}</Table.DataCell>
                <Table.DataCell>{item.status}</Table.DataCell>
                <Table.DataCell>{item.type}</Table.DataCell>
                <Table.DataCell><VStack><BodyShort>{toLocalDate(item.opprettet)}</BodyShort><BodyShort>{toLocalTime(item.opprettet)}</BodyShort></VStack></Table.DataCell>
                <Table.DataCell><VStack><BodyShort>{toLocalDate(item.oppdatert)}</BodyShort><BodyShort>{toLocalTime(item.oppdatert)}</BodyShort></VStack></Table.DataCell>
                <Table.DataCell>{JSON.stringify(JSON.parse(item.dataSendt), null, 2)}</Table.DataCell>
                <Table.DataCell>{item.dataMottatt && JSON.stringify(JSON.parse(item.dataMottatt), null, 2)}</Table.DataCell>
            </Table.Row>
        ))}
        {batches.length > 5 && <Table.ExpandableRow colSpan={5} content={"..."}></Table.ExpandableRow>}
    </Table.Body>)
}