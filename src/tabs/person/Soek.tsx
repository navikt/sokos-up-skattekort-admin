import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HStack, VStack,} from "@navikt/ds-react";
import {Dispatch, SetStateAction, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {type SokParameter} from "./SokParameter";
import {ForsystemEnum} from "../bestillMedFil/api/FlereFnrRequest";
import {thisYear} from "../../util/dateUtils";
import {z} from "zod";
import FnrTextField from "./FnrTextField";
import AarRadioGroup from "./AarRadioGroup";
import ForsystemRadioGroup from "./ForsystemRadioGroup";

export type SoekProps = {
    fnr: string;
    setSokparametre: Dispatch<SetStateAction<SokParameter>>;
    isLoading?: boolean;
    nullstillStatus: () => void;
};

const FormDataSchema = z.object({
    fnr: z.string().refine((value) => {
        return /^\d{11}$/.test(value);
    }, {message: "FNR kan bare inneholde 11 siffer"}).default("").nonoptional(),
    forsystem: ForsystemEnum.default(ForsystemEnum.enum.OS).nonoptional(),
    aar: z.number()
});

type FormData = z.infer<typeof FormDataSchema>

export default function Soek({
                                 fnr,
                                 setSokparametre,
                                 isLoading,
                                 nullstillStatus
                             }: Readonly<SoekProps>) {
    const form = useForm<FormData>({
        resolver: zodResolver(FormDataSchema),
        defaultValues: {
            fnr: "",
            forsystem: ForsystemEnum.enum.OS,
            aar: thisYear(),
        }
    });

    function handleSoekReset() {
        nullstillStatus();
        form.reset();
    }

    function handleSoekSubmit(parameter: FormData) {
        nullstillStatus();
        setSokparametre({
            fnr: parameter.fnr,
            forsystem: parameter.forsystem,
            aar: Number(parameter.aar),
        });
    }

    useEffect(() => {
        if (fnr) {
            form.setValue("fnr", fnr);
        }
    }, [fnr, form.setValue]);

    return (
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={form.handleSubmit(handleSoekSubmit)}>
                <FormProvider {...form}>
                    <VStack gap={"4"}>
                        <HStack justify="start" gap={"space-64"}>
                            <HStack gap="space-8" justify="space-evenly">
                                <ForsystemRadioGroup/>
                                <AarRadioGroup/>
                            </HStack>
                            <VStack align={"start"} justify={"space-between"} gap={"space-16"}>
                                <FnrTextField/>
                                <HStack gap="space-16" justify="end">
                                    <Button
                                        disabled={isLoading}
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
                                        disabled={isLoading}
                                        size={"small"}
                                        variant={"primary"}
                                        type={"submit"}
                                        title={"Søk"}
                                        iconPosition={"right"}
                                        icon={<MagnifyingGlassIcon aria-hidden={"true"}/>}
                                    >
                                        Søk
                                    </Button>
                                </HStack>
                            </VStack>
                        </HStack>
                    </VStack>
                </FormProvider>
            </form>
        </Box>
    );
}
