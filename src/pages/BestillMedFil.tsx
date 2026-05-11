import {BodyShort, Box, Button, FileObject, FileUpload, Heading, HGrid, Textarea} from "@navikt/ds-react";
import Errorhandler from "../components/Errorhandler";
import {ChangeEvent, useState} from "react";

const INGEN_FIL = "Ingen fil"

export default function BestillMedFil() {
    const [error, setError] = useState<Error>();
    const [files, setFiles] = useState<FileObject[]>([])
    const [fileStatus, setFileStatus] = useState<string>(INGEN_FIL)
    const [fileContentPreview, setFileContentPreview] = useState<string | null>(null)

    const file = files.length > 0 ? files[0] : null;

    async function parseFile(file: FileObject | null) {
        if (file?.file) {
            const blob = new Blob([file.file], {type: "text/plain"});
            const text = await blob.text();
            const groups = text.matchAll(/\d{11}/g).toArray()
            const cleaned = text.replaceAll(/\s/g, "")
            if (cleaned.length !== groups.length*11) {
                throw new Error("Filen må kun bestå av fnr(11 samenhengende siffer) og mellomrom/linjeskift")
            }
            const fileContent = `${groups.length > 100 ? "De 100 første fødselsnumrene i fila:" : ""} ${groups.slice(0, 100).join(" ")} ${(groups.length > 100) ? "..." : ""}`
            setFileContentPreview(fileContent)
            setFileStatus("ok");
            return true
        }
        throw new Error("Ingen fil?")
    }

async function handleFileChange(files: FileObject[]) {
    const parsedOK = await parseFile(files.length > 0 ? files[0] : null).catch(
        e => setFileStatus(e instanceof Error ? e.message : "Ukjent feil ved innlesning av fil")
    )
    if (parsedOK) setFiles(files);
}

async function handleDelete() {
    setFiles([])
    setFileStatus(INGEN_FIL)
}

return (
    <Box margin={"space-24"}>
        <Heading spacing level="3" size="medium">Bestill med fil</Heading>
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            {files.length === 0 && <FileUpload.Dropzone
                label="Last opp fil"
                description={"Du kan laste opp en ren tekstfil med ett fnr på hver linje"}
                fileLimit={{max: 1, current: files.length}}
                multiple={false}
                onSelect={handleFileChange}
            />}
            {fileStatus !== INGEN_FIL && <BodyShort>{fileStatus}</BodyShort>}
            {file &&
                <><FileUpload.Item
                    key={file.file.name}
                    file={file.file}
                    button={{
                        action: "delete",
                        onClick: () => handleDelete(),
                    }}
                />
                    <Box overflow={"hidden"} background={"surface-default"} padding={"space-16"}
                         marginBlock={"space-16 0"} borderRadius="medium">
                        <BodyShort
                            style={{overflow: "hidden", textOverflow: "ellipsis"}}>{fileContentPreview}</BodyShort>
                    </Box>
                </>
            }
        </Box>
        {error && <Errorhandler heading={"WTF"} error={error}/>}
    </Box>
)
}