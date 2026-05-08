import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, FileObject, FileUpload, HelpText, HStack, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {UtsendingRequest, UtsendingRequestSchema} from "../types/UtsendingRequest";

export type SoekFlereFnrProps = {
    fnr: string[] |null;
    // setIsSubmit: (isSubmit: boolean) => void;
    // setFnr: (fnr: string[]) => void;
    // isLoading?: boolean;
};

function formaterFnr(fnr: string) {
    return fnr.replaceAll(/\D/g, "");
}

export default function SoekFlereFnr(props: Readonly<SoekFlereFnrProps>) {
    const {
        register,
        handleSubmit,
        trigger,
        reset,
        setValue,
        formState: {errors},
    } = useForm<UtsendingRequest>({
        resolver: zodResolver(UtsendingRequestSchema),
    });

    function handleSoekReset() {
        reset();
    }

    function handleSoekSubmit(parameter: UtsendingRequest) {
        const fnr = parameter.fnr ?? [];
    }

    const [files, setFiles] = useState<FileObject[]>([])

    return (
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={handleSubmit(handleSoekSubmit)}>
                <VStack gap={"4"}>
                    <HStack justify="space-between">
                        <VStack gap={"4"}>
                        {files.length === 0 && <FileUpload.Dropzone
                            label="Last opp fil"
                            fileLimit={{max: 1, current: files.length}}
                            multiple={false}
                            onSelect={setFiles}
                        />}
                        {files.map((file) => (
                            <FileUpload.Item
                                key={file.file.name}
                                file={file.file}
                                button={{
                                    action: "delete",
                                    onClick: () => setFiles([]),
                                }}
                            />
                        ))}
                        </VStack>           
                        <HelpText placement="left" title="Om arbeidsflaten skattekort">
                            Du kan se skattekort 24 mnd tilbake i tid.
                            <br/>
                            For å se hvilken del av skattekortet som vil bli, eller er, brukt
                            i en beregning må menypunktet "Skatt og trekk" og underpunktmeny
                            "eSkattekort - Søk" i Økonomiportalen benyttes.
                        </HelpText>
                    </HStack>
                    <HStack gap="space-16" justify="end">
                        <Button
                            variant="secondary"
                            size={"small"}
                            type="button"
                            icon={<EraserIcon aria-hidden={"true"}/>}
                            iconPosition={"right"}
                            title={"Nytt søk"}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSoekReset();
                            }}
                        >
                            Nytt søk
                        </Button>
                        <Button
                            size={"small"}
                            variant={"primary"}
                            type={"submit"}
                            title={"Søk"}
                            iconPosition={"right"}
                            icon={<MagnifyingGlassIcon aria-hidden={"true"}/>}
                            onClick={() => trigger()}
                        >
                            Søk
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}
