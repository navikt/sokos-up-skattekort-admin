import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HelpText, HStack, Textarea, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {FlereFnrFormValues, FlereFnrRequest, FlereFnrRequestSchema} from "./FlereFnrRequest";

function ekstraherFnr(fnr: string): string {
    const bareTallOgMellomrom = fnr.replaceAll(/[^\d\s]/g, "");
    if (/^\s*(\d{11})(\s+\d{11})*\s*$/.test(bareTallOgMellomrom)) {
        return bareTallOgMellomrom.match(/\d{11}/g)?.join(" \n") ?? ""
    }
    return "";
}

export default function SoekFlere() {
    const {
        register,
        handleSubmit,
        trigger,
        reset,
        setValue,
        formState: {errors},
    } = useForm<FlereFnrFormValues, unknown, FlereFnrRequest>({
        resolver: zodResolver(FlereFnrRequestSchema),
    });

    function handleSoekReset() {
        reset();
    }

    const [request, setRequest] = useState<FlereFnrRequest | null>(null);
    
    const {data} = {data:null} //useFetchFlereFnr(request);
    
    function handleSoekSubmit(parameter: FlereFnrRequest) {
        setRequest(parameter)
    }

    return (
        <>
            <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={handleSubmit(handleSoekSubmit)}>
                <VStack gap={"4"}>
                    <HStack justify="space-between">
                        <Textarea
                            {...register("fnr")}
                            size={"small"}
                            autoComplete={"off"}
                            label="Fødselsnumre"
                            error={errors.fnr?.message}
                            onPaste={(event: React.ClipboardEvent<HTMLTextAreaElement>) => {
                                event.preventDefault();
                                const fraUtklippstavle = event.clipboardData.getData("text/plain");
                                const bareSiffer = ekstraherFnr(fraUtklippstavle);
                                setValue("fnr", bareSiffer);
                            }}
                        />
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
            {data && <div>{JSON.stringify(data)}</div>}
        </>
    );
}
