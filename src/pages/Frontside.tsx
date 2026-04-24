import {Box, Button, Heading, HGrid, Table, VStack} from "@navikt/ds-react";
import LabelText from "../components/LabelText";
import {
    rerunBestillingsbatch,
    useFetchBestillinger,
    useFetchBestillingsbatcher,
    useFetchUtsendinger
} from "../api/apiService";

function handleRerun(id : number | null | undefined) {
    if (!id) return;
    id && rerunBestillingsbatch(id)
}

export function Frontside() {
    
    const {data:batchData, error: batchError, isLoading:batchIsLoading} = useFetchBestillingsbatcher()
    const {data: utsendingerData, error: utsendingerError, isLoading: utsendingerIsLoading} = useFetchUtsendinger()
    const {data: bestillingerData, error: bestillingerError, isLoading: bestillingerIsLoading} = useFetchBestillinger()
    
    return (
        <VStack gap={"space-24"} padding={"space-24"}>
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"large"} spacing>Informasjon om Sokos-skattekort</Heading>
                <LabelText label={"Skattekort for 2025"} text={"3 456 789"}/>
                <LabelText label={"Skattekort for 2026"} text={"2 345 678"}/>
                <LabelText label={"Abonnementer"} text={"2 345 678"}/>
                <LabelText label={"Personer"} text={"4 567 890"}/>
                <LabelText label={"Ferdige batcher"} text={"1 234"}/>
            </Box>
        <HGrid gap="space-24" columns={2}>
            {utsendingerData?.items && <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Planlagte utsendinger</Heading>
                <Table title="Planlagte utsendinger" zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Utsending</Table.HeaderCell>
                        <Table.HeaderCell>Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell>Forsystem</Table.HeaderCell>
                        <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                        <Table.HeaderCell>Opprettet</Table.HeaderCell>
                        <Table.HeaderCell>Fail count</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {utsendingerData.items.map((item) => (
                        <Table.Row key={item.id}>
                            <Table.DataCell>{item.id}</Table.DataCell>
                            <Table.DataCell>{item.fnr}</Table.DataCell>
                            <Table.DataCell>{item.forsystem}</Table.DataCell>
                            <Table.DataCell>{item.inntektsaar}</Table.DataCell>
                            <Table.DataCell>{item.opprettet}</Table.DataCell>
                            <Table.DataCell>{item.failCount}</Table.DataCell>
                        </Table.Row>))
                    }
                </Table.Body>
            </Table></Box>
            }
            {bestillingerData?.items &&
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Planlagte bestillinger</Heading>
                <Table title="Planlagte bestillinger" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Bestilling</Table.HeaderCell>
                            <Table.HeaderCell>PersonId</Table.HeaderCell>
                            <Table.HeaderCell>Fødselsnummer</Table.HeaderCell>
                            <Table.HeaderCell>Inntektsår</Table.HeaderCell>
                            <Table.HeaderCell>Bestillingsbatch</Table.HeaderCell>
                            <Table.HeaderCell>Oppdatert</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {bestillingerData.items.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.DataCell>{item.id}</Table.DataCell>
                                    <Table.DataCell>{item.personId}</Table.DataCell>
                                    <Table.DataCell>{item.fnr}</Table.DataCell>
                                    <Table.DataCell>{item.inntektsaar}</Table.DataCell>
                                    <Table.DataCell>{item.bestillingsbatchId}</Table.DataCell>
                                    <Table.DataCell>{item.oppdatert}</Table.DataCell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </Box>}
            {batchData?.items &&
            <Box padding="6" background={"surface-default"} borderRadius="large">
                <Heading size={"medium"} spacing>Batcher under behandling</Heading>
                <Table title="Batcher under behandling" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>SKD-Referanse</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Opprettet</Table.HeaderCell>
                            <Table.HeaderCell>Oppdatert</Table.HeaderCell>
                            <Table.HeaderCell>Handling</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {batchData.items.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.DataCell>{item.id}</Table.DataCell>
                                <Table.DataCell>{item.bestillingsreferanse}</Table.DataCell>
                                <Table.DataCell>{item.status}</Table.DataCell>
                                <Table.DataCell>{item.type}</Table.DataCell>
                                <Table.DataCell>{item.opprettet}</Table.DataCell>
                                <Table.DataCell>{item.oppdatert}</Table.DataCell>
                                <Table.DataCell>
                                    {item.status === "FEILET" &&
                                        <Button variant="tertiary-neutral"  disabled={!item.id} onClick={() => handleRerun(item.id)}>Kjør om igjen</Button>}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Box>}
        </HGrid>
        </VStack>
            
    )
}