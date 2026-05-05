import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, Checkbox, CheckboxGroup, DatePicker, HStack, ReadMore, TextField, VStack,} from "@navikt/ds-react";
import {useForm} from "react-hook-form";
import {type BatchInsightRequest, BatchInsightRequestSchema} from "../types/Bestillingsbatch";
import {now} from "../util/dateUtils";
import {useCallback} from "react";

export type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
}

export type SoekProps = {
    isLoading?: boolean;
    batchInsightRequest: BatchInsightRequest | null;
    handleBatchInsightRequest: (request: BatchInsightRequest) => void;
    filters: string[];
    setFilters: (filters: Array<string>) => void;
    batchTyper: string[];
    setBatchTyper: (batchTyper: string[]) => void;
    handleOpenChange: (e: boolean) => void;
};

export default function SoekBatch({
                                      isLoading,
                                      handleBatchInsightRequest,
                                      batchTyper,
                                      setBatchTyper,
                                      filters,
                                      setFilters,
                                      handleOpenChange
                                  }: Readonly<SoekProps>) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
        setValue,
    } = useForm<BatchInsightRequest>({
        resolver: zodResolver(BatchInsightRequestSchema),
        defaultValues: {tidspunktFom: new Date(now().getTime() - 60 * 60 * 1000 * 3).toISOString(), tidspunktTom: null},
    });

    function handleSoekReset() {
        reset()
    }

    function onSubmit(data: BatchInsightRequest) {
        handleBatchInsightRequest({
            tidspunktFom: data?.tidspunktFom ? new Date(data.tidspunktFom.replace(",", ".")).toISOString() : null,
            tidspunktTom: data?.tidspunktTom ? new Date(data.tidspunktTom.replace(",", ".")).toISOString() : null
        });
    }

    const handlePickDate = useCallback((dateRange: DateRange) => {
        setValue("tidspunktFom", dateRange?.from?.toISOString() ?? null);
        setValue("tidspunktTom", dateRange?.to ? new Date(dateRange?.to?.getTime() + 1000 * 24 * 60 * 60 - 1).toISOString() : null);
    }, [setValue])

    return (
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack justify={"space-between"} gap={"space-16"}>
                    <VStack>
                        <HStack gap={"space-8"}><TextField
                            {...register("tidspunktFom")}
                            size={"small"}
                            htmlSize={30}
                            maxLength={27}
                            label="Dato FOM"
                            error={errors.tidspunktFom?.message}
                        />
                            <TextField
                                {...register("tidspunktTom")}
                                size={"small"}
                                htmlSize={30}
                                maxLength={27}
                                label="Dato TOM"
                                error={errors.tidspunktTom?.message}
                            /></HStack> </VStack>

                    <VStack minWidth={"420px"}>
                        <ReadMore onOpenChange={handleOpenChange} header={"Datovelger"} size={"small"}>
                            <DatePicker.Standalone mode={"range"} onSelect={(dateRange) =>
                                dateRange ? handlePickDate({from: dateRange.from, to: dateRange.to}) : null}/>
                        </ReadMore>
                    </VStack>
                    <VStack><HStack gap={"space-8"}><Box
                        padding={"space-16"}
                        borderWidth={"2"}
                    >
                        <CheckboxGroup legend="Vis" value={batchTyper} onChange={setBatchTyper}>
                            <Checkbox value="OPPDATERING">Oppdatering</Checkbox>
                            <Checkbox value="BESTILLING">Bestilling</Checkbox>
                        </CheckboxGroup>
                    </Box>
                        <Box
                            padding={"space-16"}
                            borderWidth={"2"}
                        >
                            <CheckboxGroup legend="Skjul" value={filters} onChange={setFilters}>
                                <Checkbox value="Ingen endringer"
                                          disabled={!batchTyper.includes("OPPDATERING") || filters.includes("FERDIG")}>
                                    Oppdateringsbatcher uten endringer</Checkbox>
                                <Checkbox value="FERDIG">Ferdige batcher</Checkbox>
                            </CheckboxGroup>
                        </Box></HStack></VStack>

                    <VStack justify={"end"}>
                        <HStack gap={"space-16"}>
                            <Button
                                disabled={isLoading}
                                variant="secondary"
                                size={"small"}
                                type="button"
                                icon={<EraserIcon aria-hidden={"true"}/>}
                                iconPosition={"right"}
                                title={"Nytt søk"}
                                onClick={() => {
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
                            <Button
                                disabled={isLoading}
                                variant="primary"
                                size={"small"}
                                type="button"
                                icon={<EraserIcon aria-hidden={"true"}/>}
                                iconPosition={"right"}
                                title={"Standardsøk"}
                                onClick={() => {
                                    handleBatchInsightRequest({
                                        tidspunktFom: null,
                                        tidspunktTom: null,
                                    })
                                }}
                            >
                                Standardsøk
                            </Button>
                        </HStack>
                    </VStack>
                </HStack>
            </form>
        </Box>
    );
}
