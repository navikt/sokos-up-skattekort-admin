import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {
    BodyLong,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Dialog,
    HStack,
    ReadMore,
    TextField,
    VStack,
} from "@navikt/ds-react";
import {useForm} from "react-hook-form";
import {type BatchInsightRequest, BatchInsightRequestSchema} from "./api/Bestillingsbatch";
import {A_DAY, type DateRange, plus23H59m59s, timeBetweenIsoStrings, toZulu} from "../../util/dateUtils";
import {type Dispatch, type SetStateAction, useCallback, useEffect, useState} from "react";

export type SoekProps = {
    isLoading?: boolean;
    batchInsightRequestState: {value: BatchInsightRequest|null, set: Dispatch<SetStateAction<BatchInsightRequest|null>>|null};
    batchTyperState: {value: string[], set: Dispatch<SetStateAction<string[]>>|null};
    filtersState: {value: string[], set: Dispatch<SetStateAction<string[]>>|null};
};

export default function SoekBatch({
                                      isLoading,
                                      batchInsightRequestState,
                                      batchTyperState,
                                      filtersState,
                                  }: Readonly<SoekProps>) {
    const [showLongRangeWarning, setShowLongRangeWarning] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState<BatchInsightRequest | null>(null);
    const defaultBatchInsightRequest = {tidspunktFom: null, tidspunktTom: null}
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        reset,
    } = useForm<BatchInsightRequest>({
        resolver: zodResolver(BatchInsightRequestSchema),
        defaultValues: defaultBatchInsightRequest
    })

    function handleSoekReset() {
        batchInsightRequestState?.set?.(defaultBatchInsightRequest);
        reset();
    }

    function executeSearch(data: BatchInsightRequest) {
        batchInsightRequestState?.set?.({
            tidspunktFom: data?.tidspunktFom ?
                new Date(data.tidspunktFom.replace(",", ".")).toISOString() : null,
            tidspunktTom: data?.tidspunktTom ?
                new Date(data.tidspunktTom.replace(",", ".")).toISOString() : null
        });
    }

    function onSubmit(formData: BatchInsightRequest) {
        if (!formData.tidspunktFom) {
            throw new Error("TidspunktFom should have been enforced");
        }

        const diffMs = timeBetweenIsoStrings(formData.tidspunktFom, formData.tidspunktTom);

        if (diffMs > 3 * A_DAY) {
            setPendingSubmit(formData);
            setShowLongRangeWarning(true);
        }

        executeSearch(formData);
    }

    function handleConfirmProceed() {
        if (!pendingSubmit) return;
        executeSearch(pendingSubmit); // "Jeg vet hva jeg gjør"
        setShowLongRangeWarning(false);
        setPendingSubmit(null);
    }

    function handleSetTomToThreeDaysAfterFom() {
        if (!pendingSubmit?.tidspunktFom) return;

        const fom = new Date(pendingSubmit.tidspunktFom.replace(",", "."));
        const omTreDager = new Date(fom.getTime() + 3 * A_DAY);

        const next: BatchInsightRequest = {
            ...pendingSubmit,
            tidspunktTom: omTreDager.toISOString(),
        };

        setValue("tidspunktTom", next.tidspunktTom); // oppdater feltet i skjema
        executeSearch(next);

        setShowLongRangeWarning(false);
        setPendingSubmit(null);
    }

    function handleCancelSearch() {
        setShowLongRangeWarning(false);
        setPendingSubmit(null);
    }

    const handlePickDate = useCallback((dateRange: DateRange) => {
        setValue("tidspunktFom", dateRange?.from?.toISOString() ?? null);
        setValue("tidspunktTom", dateRange?.to ? plus23H59m59s(dateRange.to).toISOString() : null);
    }, [setValue])

    useEffect(() => {
        if (batchInsightRequestState?.value != null) {
            setValue("tidspunktFom", batchInsightRequestState.value.tidspunktFom ?? null);
            setValue("tidspunktTom", batchInsightRequestState.value.tidspunktTom ?? null);
        }
    }, [batchInsightRequestState?.value, setValue]);

    return (
        <><Box padding="space-24" background={"meta-purple-soft"} borderRadius="8">
            <form onSubmit={handleSubmit(onSubmit)}>
                <HStack justify={"space-between"} gap={"space-16"}>
                    <VStack>
                        <HStack gap={"space-8"}><TextField
                            {...register("tidspunktFom")}
                            size={"small"}
                            htmlSize={30}
                            maxLength={27}
                            label="Dato FOM"
                            onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => {
                                event.preventDefault();
                                setValue("tidspunktFom", toZulu(event.clipboardData.getData("text/plain")));
                            }}
                            defaultValue={batchInsightRequestState?.value?.tidspunktFom ?? ""}
                            error={errors.tidspunktFom?.message}
                        />
                            <TextField
                                {...register("tidspunktTom")}
                                size={"small"}
                                htmlSize={30}
                                maxLength={27}
                                label="Dato TOM"
                                onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => {
                                    event.preventDefault();
                                    setValue("tidspunktTom", toZulu(event.clipboardData.getData("text/plain")));
                                }}
                                defaultValue={batchInsightRequestState?.value?.tidspunktTom ?? ""}
                                error={errors.tidspunktTom?.message}
                            /></HStack> </VStack>

                    <VStack minWidth={"420px"}>
                        <ReadMore header={"Datovelger"} size={"small"}>
                            <DatePicker.Standalone mode={"range"} onSelect={(dateRange) =>
                                dateRange ? handlePickDate({from: dateRange.from, to: dateRange.to}) : null}/>
                        </ReadMore>
                    </VStack>
                    <VStack><HStack gap={"space-8"}><Box
                        padding={"space-16"}
                        borderWidth={"2"}
                    >
                        <CheckboxGroup legend="Vis" value={batchTyperState?.value} onChange={(batchtyper:string[]) => batchTyperState?.set?.(batchtyper)}>
                            <Checkbox value="OPPDATERING">Oppdatering</Checkbox>
                            <Checkbox value="BESTILLING">Bestilling</Checkbox>
                        </CheckboxGroup>
                    </Box>
                        <Box
                            padding={"space-16"}
                            borderWidth={"2"}
                        >
                            <CheckboxGroup legend="Skjul" value={filtersState?.value} onChange={(filters: string[]) => filtersState?.set?.(filters)}>
                                <Checkbox value="Ingen endringer"
                                          disabled={!batchTyperState?.value.includes("OPPDATERING") || filtersState?.value.includes("FERDIG")}>
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
                                        onClick={handleSoekReset}
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
                    </form>
                </Box>
            <Dialog open={showLongRangeWarning} onOpenChange={handleCancelSearch}>
                <Dialog.Popup id={"long time interval"}>
                    <Dialog.Header>
                        <Dialog.Title>Lang tidsperiode</Dialog.Title>
                        <Dialog.Description>Du har valgt en tidsperiode på mer enn 3 dager.</Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                        <BodyLong>Dette kan gi svært mye data. Bruk knappen "3 dager" for å sette
                            til-og-med-dato til 3 dager etter fra-og-med-dato.</BodyLong>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.CloseTrigger>
                            <Button variant="secondary">Avbryt</Button>
                        </Dialog.CloseTrigger>
                        <Button onClick={handleSetTomToThreeDaysAfterFom}>3 dager</Button>
                        <Button variant={"danger"} onClick={handleConfirmProceed}>Jeg vet hva jeg gjør</Button>
                    </Dialog.Footer>

                </Dialog.Popup>
            </Dialog></>
    );
}
