import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HStack, VStack,} from "@navikt/ds-react";
import {Dispatch, SetStateAction, useEffect} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {type SokParameter, SokParameterSchema} from "./SokParameter";
import {ForsystemEnum} from "../bestillMedFil/api/FlereFnrRequest";
import {thisYear} from "../../util/dateUtils";
import FnrTextField from "./FnrTextField";
import AarRadioGroup from "./AarRadioGroup";
import ForsystemRadioGroup from "./ForsystemRadioGroup";

export type SoekProps = {
    fnr: string;
    setSokparametre: Dispatch<SetStateAction<SokParameter>>;
    isLoading?: boolean;
    nullstillStatus: () => void;
};

export default function Soek({
                                 fnr,
                                 setSokparametre,
                                 isLoading,
                                 nullstillStatus
                             }: Readonly<SoekProps>) {
    const form = useForm<SokParameter>({
        resolver: zodResolver(SokParameterSchema),
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

    function handleSoekSubmit(parameter: SokParameter) {
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
        <Box padding="space-24" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={form.handleSubmit(handleSoekSubmit)}>
                <FormProvider {...form}>
                    <VStack gap={"space-16"}>
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
