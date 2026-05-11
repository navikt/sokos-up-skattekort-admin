import {BodyLong, BodyShort, Box, FileObject, FileUpload, Heading, Label} from "@navikt/ds-react";
import Errorhandler from "../components/Errorhandler";
import {useState} from "react";

const INGEN_FIL = "Ingen fil"

export default function BestillMedFil() {
    const [error, setError] = useState<Error>();
    const [files, setFiles] = useState<FileObject[]>([])
    const [fileStatus, setFileStatus] = useState<string>(INGEN_FIL)
    const [fileContent, setFileContent] = useState<string | null>(null)

    const file = files.length > 0 ? files[0] : null;

    async function parseFile(file: FileObject | null) {
        handleDelete();
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
            setFileStatus("ok");
            setFiles([file])
            return true
        }
        throw new Error("Ingen fil?")
    }

    async function handleFileChange(files: FileObject[]) {
        const parsedOK = await parseFile(files.length > 0 ? files[0] : null).catch(
            e => setFileStatus(e instanceof Error ? e.message : "Ukjent feil ved validering av fil")
        )
        if (parsedOK) setFiles(files);
    }

    function handleDelete() {
        setFiles([])
        setFileStatus(INGEN_FIL)            
        setFileContent(null)
    }

    return (
        <Box margin={"space-24"}>
            <Heading spacing level="3" size="medium">Bestill med fil</Heading>
            <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
                {files.length === 0 && <FileUpload.Dropzone
                    label="Last opp fil"
                    description={"Støtter rene tekstfiler med fnr og mellomrom/linjeskift"}
                    fileLimit={{max: 1, current: files.length}}
                    multiple={false}
                    onSelect={handleFileChange}
                />}
                {file &&
                    <FileUpload.Item
                        key={file.file.name}
                        file={file.file}
                        button={{
                            action: "delete",
                            onClick: () => handleDelete(),
                        }}
                    />}
                <Box overflow={"hidden"} background={"surface-default"} padding={"space-16"} marginBlock={"space-16 0"} borderRadius="medium">
                    <BodyShort>Filstatus: {fileStatus}</BodyShort>
                </Box>
                <Box overflow={"hidden"} background={"surface-default"} padding={"space-16"} marginBlock={"space-16 0"} borderRadius="medium">
                    <Label>Innhold i fil:</Label>
                    <BodyLong
                        style={{overflow: "hidden", textOverflow: "ellipsis"}}>{fileContent}</BodyLong>
                </Box>
            </Box>
            {error && <Errorhandler heading={"Feil fra backend"} error={error}/>}
        </Box>
    )
}