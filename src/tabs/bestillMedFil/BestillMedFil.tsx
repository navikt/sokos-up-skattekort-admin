import {
    BodyLong,
    BodyShort,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    type FileObject,
    FileUpload,
    Heading,
    HGrid,
    HStack,
    Label,
    Table,
    VStack
} from "@navikt/ds-react";
import Errorhandler from "../../common/Errorhandler";
import {useState} from "react";
import AlertWithCloseButton from "../../common/AlertWithCloseButton";
import {postForesoerselfil, useFetchStatuses} from "./api/api";
import OpprettAbonnementModal from "./OpprettAbonnementModal";
import JaValg from "./JaValg";
import NeiValg from "./NeiValg";
import {DetailStatus} from "./api/DetailStatus";
import {foedselsnummerkategori} from "../../util/fnrUtils";
import {Forsystem} from "./api/FlereFnrRequest";

const INGEN_FIL = "Ingen fil"

interface BestillMedFilProps {
    handleVisPerson: (fnr: string) => void;
}

export default function BestillMedFil({handleVisPerson}: Readonly<BestillMedFilProps>) {
    const [error, setError] = useState<Error>();
    const [file, setFile] = useState<FileObject | null>(null)
    const [fileStatus, setFileStatus] = useState<string>(INGEN_FIL)
    const [fileContent, setFileContent] = useState<string | null>(null)
    const [alert, setAlert] = useState<string | null>(null)
    const {data} = useFetchStatuses(file)
    const statusRows = Object.entries(data?.statuses ?? {});
    const [aar, setAar] = useState<number[]>([])
    const [forsystemer, setForsystemer] = useState<Forsystem[]>([])
    const [alertMessages, setAlertMessages] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    }[]>([]);


    async function parseFile(file: FileObject | null) {
        handleReset();
        if (file?.file) {
            const blob = new Blob([file.file], {type: "text/plain"});
            const text = await blob.text();
            if (!text) throw new Error("Finner ingen tekst i fila")
            const groups = text.matchAll(/\d{11}/g).toArray()
            const cleaned = text.replaceAll(/\s/g, "")
            if (cleaned.length !== groups.length * 11) {
                throw new Error("Filen må kun bestå av fnr(11 sammenhengende siffer) og mellomrom/linjeskift")
            }
            setFileContent(text)
            setFileStatus("ok")
            setFile(file)
            return true
        }
        throw new Error("Ingen fil?")
    }

    async function handleFileChange(files: FileObject[]) {
        const parsedOK = await parseFile(files.length > 0 ? files[0] : null).catch(
            e => setFileStatus(e instanceof Error ? e.message : "Ukjent feil ved validering av fil")
        )
        if (parsedOK) setFile(files.length > 0 ? files[0] : null);
    }

    function handleReset() {
        setFile(null)
        setFileStatus(INGEN_FIL)
        setFileContent(null)
        setAlert(null)
        setError(undefined)
    }

    const lastYear = new Date().getFullYear() - 1;
    const thisYear = new Date().getFullYear();
    const nextYear = new Date().getFullYear() + 1;

    const hasSkattekort =
        (year: number, status: DetailStatus) =>
            (year === lastYear) ? status.skattekortLastYear
                : (year === thisYear) ? status.skattekortThisYear
                    : (year === nextYear) ? status.skattekortNextYear
                        : false;

    function handleOpprettAbonnement() {
        for (const hvertAar of aar) {
            for (const hvertForsystem of forsystemer) {
                postForesoerselfil(file, hvertForsystem, hvertAar)
                    .then(response => {
                        console.log(`${hvertForsystem} ${hvertAar} vellykket faktisk(?): ${JSON.stringify(response, null, 2)}`)
                        
                        if (response.error){
                            setAlertMessages(prev => [...prev, {
                                message: `${hvertForsystem} for år ${hvertAar} : ${response.error?.meldingFraBackend}`,
                                variant: "error",
                            }])
                        } else {
                            setAlertMessages(prev => [...prev, {
                                message: `Sendt forespørsel og opprettet abonnement for alle fnr til ${hvertForsystem} for år ${hvertAar}`,
                                variant: "success",
                            }])
                        }
                    })
                    .catch(error => {
                        console.log(`${hvertForsystem} ${hvertAar} mislykket: ${JSON.stringify(error, null, 2)}`)
                        setAlertMessages(prev => [...prev, {
                            message: `Feil for ${hvertForsystem} ${hvertAar}`,
                            variant: "error",
                        }])
                    })
            }
        }
    }

    function removeAlertMessage(alertMessage: string) {
        setAlertMessages(prev => prev.filter(msg => msg.message !== alertMessage))
    }

    return (
        <Box margin={"space-24"}>
            <Heading spacing level="3" size="medium">Bestill med fil</Heading>
            <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
        <HGrid columns={!!file ? "1fr 240px" : "1"} gap={"space-16"}>
            <VStack >
                {file === null && <FileUpload.Dropzone
                    label="Last opp fil"
                    description={"Støtter rene tekstfiler med fnr og mellomrom/linjeskift."}
                    fileLimit={{max: 1, current: file ? 1 : 0}}
                    multiple={false}
                    onSelect={handleFileChange}
                />}
                {file &&
                    <FileUpload.Item
                        key={file.file.name}
                        file={file.file}
                        button={{
                            action: "delete",
                            onClick: () => handleReset(),
                        }}
                    />}
                <Box overflow={"hidden"} background={"surface-default"} padding={"space-16"} marginBlock={"space-16 0"}
                     borderRadius="medium">
                    <BodyShort>Filstatus: {fileStatus}</BodyShort>
                </Box>
                <Box overflow={"hidden"} background={"surface-default"} padding={"space-16"} marginBlock={"space-16 0"}
                     borderRadius="medium">
                    <Label>Innhold i fil:</Label>
                    <BodyLong
                        style={{overflow: "hidden", textOverflow: "ellipsis"}}>{fileContent}</BodyLong>
                </Box>
            </VStack>
            {file &&
                    <VStack width="240px" gap={"space-16"}>
                        <BodyLong>
                            Opprett abonnement for alle fnr
                        </BodyLong>
                        <HStack gap="space-8" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} onChange={setForsystemer}>
                                <Checkbox value={"OS"}>OS</Checkbox>
                                <Checkbox value={"OS_STOR"}>OS_STOR</Checkbox>
                                <Checkbox value={"DARE_POC"}>DARE_POC</Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup legend={"År"} onChange={setAar}>
                                <Checkbox key={thisYear - 1} value={thisYear - 1}>{thisYear - 1}</Checkbox>
                                <Checkbox key={thisYear} value={thisYear}>{thisYear}</Checkbox>
                                <Checkbox key={thisYear + 1} value={thisYear + 1}>{thisYear + 1}</Checkbox>
                            </CheckboxGroup>
                        </HStack>
                        <Button disabled={!file || forsystemer.length == 0 || aar.length == 0} 
                                onClick={handleOpprettAbonnement}>Bestill for alle fnr</Button>

                    </VStack>
            }
            </HGrid>
            </Box>

            {alert && <AlertWithCloseButton
                show={!!alert}
                setShow={() => setAlert(null)}
                variant={"info"}
            >
                {alert}
            </AlertWithCloseButton>}
            {alertMessages.length > 0 && alertMessages.map(alertMessage => 
                <AlertWithCloseButton
                    key={alertMessage.message}
                    show={!!alertMessage}
                    setShow={() => removeAlertMessage(alertMessage.message)}
                    variant={alertMessage.variant}
                >
                    {alertMessage.message}
                </AlertWithCloseButton>
            )}
            {error && <Errorhandler heading={"Feil under kommunikasjon med sokos-skattekort"} error={error}/>}

            {statusRows.length > 0 && (
                <Box background={"surface-default"} padding="space-16" borderRadius="medium">
                    <Table zebraStripes size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Fnr</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Abonnementer</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Skattekort for {lastYear}</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Skattekort for {thisYear}</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Skattekort for {nextYear}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {statusRows.map(([fnr, status]) => (
                                <Table.Row key={fnr}>
                                    <Table.DataCell><Button variant={"tertiary"}
                                                            onClick={() => handleVisPerson(fnr)}>{fnr}</Button></Table.DataCell>
                                    <Table.DataCell>{foedselsnummerkategori(fnr)}</Table.DataCell>
                                    <Table.DataCell><HStack>
                                        {status.abonnements.filter(Boolean).join(", ") || "-"}
                                        <OpprettAbonnementModal fnr={fnr} abonnementer={status.abonnements}/>
                                    </HStack></Table.DataCell>
                                    {[lastYear, thisYear, nextYear].map(year => (
                                        <Table.DataCell key={year}>{hasSkattekort(year, status) ?
                                            <JaValg fnr={fnr} inntektsaar={year} abonnementer={status.abonnements}/>
                                            : <NeiValg fnr={fnr} inntektsaar={year}
                                                       abonnementer={status.abonnements}/>}</Table.DataCell>)
                                    )}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Box>
            )}
        </Box>
    )
}