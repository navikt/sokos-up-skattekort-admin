import {Box, Button, Heading, HGrid, Switch, Table, VStack} from "@navikt/ds-react";
import LabelText from "../components/LabelText";
import {
    rerunBestillingsbatch,
    useFetchBestillinger,
    useFetchBestillingsbatcher,
    useFetchNoekkelinformasjon,
    useFetchUtsendinger
} from "../api/apiService";
import {useState} from "react";
import Errorhandler from "../components/Errorhandler";

function handleRerun(id: number | null | undefined) {
    if (!id) return;
    id && rerunBestillingsbatch(id)
}

export function Frontside() {
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

    const {data: noekkeldata, error: noekkeldataError} = useFetchNoekkelinformasjon(shouldRefresh)
    
    const {data: batchData, error: batchError, isLoading: batchIsLoading} = useFetchBestillingsbatcher(shouldRefresh)
    const {
        data: utsendingerData,
        error: utsendingerError,
        isLoading: utsendingerIsLoading
    } = useFetchUtsendinger(shouldRefresh)
    const {
        data: bestillingerData,
        error: bestillingerError,
        isLoading: bestillingerIsLoading
    } = useFetchBestillinger(shouldRefresh)


    return (
        <VStack gap={"space-24"} padding={"space-24"}>
            <Heading size={"large"} spacing>Informasjon om Sokos-skattekort</Heading>
            
            <Errorhandler heading="noekkeldata" error={noekkeldataError} />
            <Errorhandler heading="batch" error={batchError} />
            <Errorhandler heading="bestillinger" error={bestillingerError} />
            <Errorhandler heading="utsendinger" error={utsendingerError} />
            
            {noekkeldata && <Box padding="6" background={"surface-default"} borderRadius="large">
                {Object.keys(noekkeldata.antallAvHver).map((antallAv) => (
                    <LabelText key={antallAv} label={`Antall ${Number.isNaN(Number(antallAv)) ? "" : "skattekort for "}${antallAv}`} 
                               text={noekkeldata.antallAvHver[antallAv] ?? "0"}/>
                ))}                
            </Box>}
            <Switch
                value="live"
                checked={shouldRefresh}
                onChange={(e) => setShouldRefresh((x) => (x ? false : e.target.value === "live"))}
            > Automatisk oppdatering av tabellene</Switch>
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
                                                <Button variant="tertiary" disabled={!item.id}
                                                        onClick={() => handleRerun(item.id)}>Kjør om igjen</Button>}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Box>}
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
            </HGrid>
        </VStack>

    )
}