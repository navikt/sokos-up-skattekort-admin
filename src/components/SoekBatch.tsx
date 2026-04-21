import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HelpText, HStack, TextField, VStack,} from "@navikt/ds-react";
import {useForm} from "react-hook-form";
import {type BatchInsightRequest, BatchInsightRequestSchema} from "../types/Bestillingsbatch";
import React from "react";

export type SoekProps = {
    isLoading?: boolean;
    batchInsightRequest: BatchInsightRequest | null;
    handleBatchInsightRequest: (request: BatchInsightRequest) => void;
};

export default function SoekBatch({isLoading, handleBatchInsightRequest}: Readonly<SoekProps>) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<BatchInsightRequest>({
        resolver: zodResolver(BatchInsightRequestSchema),
        defaultValues: {tidspunktFom: new Date("2025").toISOString(), tidspunktTom: null},
    });

    function handleSoekReset() {
        reset()
    }

    function onSubmit(data: BatchInsightRequest) {
        handleBatchInsightRequest({
            tidspunktFom: data?.tidspunktFom,
            tidspunktTom: data?.tidspunktTom,
        });
    }

    return (
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">

            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={"4"}>
                    <HStack justify="space-between">
                        <TextField
                            {...register("tidspunktFom")}
                            size={"small"}
                            htmlSize={30}
                            maxLength={27}
                            label="Dato FOM"
                            error={errors.tidspunktFom?.message}
                            onBlur={(e) => {e.preventDefault()}}
                        />
                        <TextField
                            {...register("tidspunktTom")}
                            size={"small"}
                            htmlSize={30}
                            maxLength={27}
                            label="Dato TOM"
                            error={errors.tidspunktTom?.message}
                        />
                        <HelpText placement="left" title="Om arbeidsflaten skattekort">
                            Datoformat eksempler: 2026-01-01, 2026-01-01T01:01, 2026-01-01T01:01, 2026-01-01T01:01:01.123456.
                            Kan også ha stor Z til slutt for å spesifisere tidspunkt på samme tidssone som i databasen
                        </HelpText>
                    </HStack>
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
            </form>
        </Box>
    );
}
