import {Box, Button, Heading, HGrid, LocalAlert, Skeleton, Switch, Table, VStack} from "@navikt/ds-react";
import LabelText from "../../common/LabelText";
import {useState} from "react";
import AlertWithCloseButton from "../../common/AlertWithCloseButton";
import {toLocalDateTime} from "../../util/dateUtils";
import {
    useFetchAlleUferdigeBestillingsbatcher, useFetchLiveBestillinger,
    useFetchNoekkelinformasjon,
    useFetchLiveUtsendinger,
    rerunBestillingsbatch
} from "./api/api";

export type FrontsideProps = {
    handleVisPerson: (fnr: string) => void;
    handleShowBatchesAround: (date: Date) => void;
}

export function Frontside({handleVisPerson, handleShowBatchesAround}: Readonly<FrontsideProps>) {
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

    const {
        data: noekkeldata,
        error: noekkeldataError,
        isLoading: noekkeldataIsLoading
    } = useFetchNoekkelinformasjon(shouldRefresh)

    const {
        data: batchData,
        error: batchError,
        isLoading: batchIsLoading,
        mutate: mutateBatches
    } = useFetchAlleUferdigeBestillingsbatcher(shouldRefresh)
    const {
        data: utsendingerData,
        error: utsendingerError,
        isLoading: utsendingerIsLoading
    } = useFetchLiveUtsendinger(shouldRefresh)
    const {
        data: bestillingerData,
        error: bestillingerError,
        isLoading: bestillingerIsLoading
    } = useFetchLiveBestillinger(shouldRefresh)
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);

    async function handleRerun(id: number | null | undefined) {
        if (!id) return;
        id && rerunBestillingsbatch(id)
            .then(response => {
                if (response === "Success") {
                    setAlertMessage({
                        message: "Bestillingsbatch kjøres på nytt",
                        variant: "success",
                    });
                    mutateBatches();
                }
            })
            .catch((error) => {
                setAlertMessage({message: error.message, variant: "error"});
            });
    }

    function safeParseJson(error: Error): string {
        try {
            return JSON.parse(error.message);
        } catch (_) {
            return error.message;
        }
    }

    return (
        <VStack gap={"space-24"} padding={"space-24"}>
            <Heading size={"large"} spacing>Informasjon om Sokos-skattekort</Heading>
            {!!alertMessage && (
                <AlertWithCloseButton
                    show={!!alertMessage}
                    setShow={() => setAlertMessage(null)}
                    variant={alertMessage.variant}
                >
                    {alertMessage.message}
                </AlertWithCloseButton>
            )}
            {noekkeldataIsLoading &&
                <Skeleton variant={"rounded"} height={142}/>
            }
            {noekkeldataError && <LocalAlert status="error">
                <LocalAlert.Header>
                    <LocalAlert.Title>
                        Kunne ikke hente nøkkeldata
                    </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <pre>{JSON.stringify(safeParseJson(noekkeldataError), null, 2)}</pre>
                </LocalAlert.Content>
            </LocalAlert>
            }
            {noekkeldata && <Box padding="space-24" background={"default"} borderRadius="8">
                {Object.keys(noekkeldata.antallAvHver).map((antallAv) => (
                    <LabelText key={antallAv}
                               label={`Antall ${Number.isNaN(Number(antallAv)) ? "" : "skattekort for "}${antallAv}`}
                               text={noekkeldata.antallAvHver[antallAv] ?? "0"}/>
                ))}
            </Box>}
            <Switch
                value="live"
                checked={shouldRefresh}
                onChange={(e) => setShouldRefresh((x) => (x ? false : e.target.value === "live"))}
            > Automatisk oppdatering av tabellene</Switch>
            {batchIsLoading &&
                <Skeleton variant={"rounded"} height={250}/>
            }
            {batchError && <LocalAlert status="error">
                <LocalAlert.Header>
                    <LocalAlert.Title>
                        Kunne ikke hente batchdata
                    </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <pre>{JSON.stringify(safeParseJson(batchError), null, 2)}</pre>
                </LocalAlert.Content>
            </LocalAlert>
            }
            {batchData?.items &&
                <Box padding="space-24" background={"default"} borderRadius="8">
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
                                    <Table.DataCell>{toLocalDateTime(item.opprettet)}</Table.DataCell>
                                    <Table.DataCell>{toLocalDateTime(item.oppdatert)}</Table.DataCell>
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
            <HGrid gap="space-24" columns={2}>
                {utsendingerIsLoading &&
                    <Skeleton variant={"rounded"} height={500}/>
                }
                {utsendingerError && <LocalAlert status="error">
                    <LocalAlert.Header>
                        <LocalAlert.Title>
                            Kunne ikke hente planlagte utsendinger
                        </LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <pre>{JSON.stringify(safeParseJson(utsendingerError), null, 2)}</pre>
                    </LocalAlert.Content>
                </LocalAlert>
                }
                {utsendingerData?.items && <Box padding="space-24" background={"default"} borderRadius="8">
                    <Heading size={"medium"}
                             spacing>{`Planlagte utsendinger(${utsendingerData.items.length})`}</Heading>
                    <Table title={`Planlagte utsendinger(${utsendingerData.items.length})`} zebraStripes>
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
                                    <Table.DataCell><Button variant={"tertiary"}
                                                            onClick={() => handleVisPerson(item.fnr)}>{item.fnr}</Button></Table.DataCell>
                                    <Table.DataCell>{item.forsystem}</Table.DataCell>
                                    <Table.DataCell>{item.inntektsaar}</Table.DataCell>
                                    <Table.DataCell>{toLocalDateTime(item.opprettet)}</Table.DataCell>
                                    <Table.DataCell>{item.failCount}</Table.DataCell>
                                </Table.Row>))
                            }
                        </Table.Body>
                    </Table></Box>
                }
                {bestillingerIsLoading &&
                    <Skeleton variant={"rounded"} height={500}/>
                }
                {bestillingerError && <LocalAlert status="error">
                    <LocalAlert.Header>
                        <LocalAlert.Title>
                            Kunne ikke hente planlagte bestillinger
                        </LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <pre>{JSON.stringify(safeParseJson(bestillingerError), null, 2)}</pre>
                    </LocalAlert.Content>
                </LocalAlert>
                }
                {bestillingerData?.items &&
                    <Box padding="space-24" background={"default"} borderRadius="8">
                        <Heading size={"medium"}
                                 spacing>{`Planlagte bestillinger(${bestillingerData.items.length})`} </Heading>
                        <Table title={`Planlagte bestillinger(${bestillingerData.items.length})`} zebraStripes>
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
                                        <Table.DataCell><Button variant={"tertiary"}
                                                                onClick={() => handleVisPerson(item.fnr)}>{item.fnr}</Button></Table.DataCell>
                                        <Table.DataCell>{item.inntektsaar}</Table.DataCell>
                                        <Table.DataCell>{item.bestillingsbatchId}</Table.DataCell>
                                        <Table.DataCell><Button variant={"tertiary"}
                                                                onClick={() => handleShowBatchesAround(new Date(item.oppdatert))}>{toLocalDateTime(item.oppdatert)}</Button></Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Box>}
            </HGrid>
        </VStack>
    );
}