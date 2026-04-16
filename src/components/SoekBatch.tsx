import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HStack, VStack,} from "@navikt/ds-react";
import {useForm} from "react-hook-form";
import {type BatchInsightRequest, BatchInsightRequestSchema} from "../types/Bestillingsbatch";
import DateTimePicker from "./DateTimePicker";
import {useState} from "react";

export type SoekProps = {
    isLoading?: boolean;
    batchInsightRequest: BatchInsightRequest | null;
    handleBatchInsightRequest: (request: BatchInsightRequest) => void;
};

export default function SoekBatch({isLoading, handleBatchInsightRequest}: Readonly<SoekProps>) {

    const [tidspunktFom, setTidspunktFom] = useState<Date | null>(null)
    const [tidspunktTom, setTidspunktTom] = useState<Date | null>(null)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<BatchInsightRequest>({
        resolver: zodResolver(BatchInsightRequestSchema),
    });

    function handleSoekReset() {
        setTidspunktFom(null)
        setTidspunktTom(null)
        reset()
    }

    function handleKlikk() {
        handleBatchInsightRequest({
            tidspunktTom: tidspunktTom?.toISOString(),
            tidspunktFom: tidspunktFom?.toISOString()
        });
    }

    return (
        <Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
            <form onSubmit={handleSubmit(handleBatchInsightRequest)}>
                <VStack gap={"4"}>
                    <HStack justify="space-between">
                        <VStack>
                            <DateTimePicker
                                {...register("tidspunktFom")}
                                labelText={"Tidspunkt FOM "}
                                selectedDate={tidspunktFom}
                                setSelectedDate={date => {
                                    if (date) setTidspunktFom(date);
                                }}
                            />
                            <DateTimePicker
                                {...register("tidspunktTom")}
                                labelText={"Tidspunkt TOM "}
                                selectedDate={tidspunktTom}
                                setSelectedDate={date => {
                                    if (date) setTidspunktTom(date);
                                }}
                            />
                        </VStack>
                        <HStack gap="space-16" justify="end">
                            <VStack><Button
                                disabled={isLoading}
                                variant="secondary"
                                size={"small"}
                                type="button"
                                icon={<EraserIcon aria-hidden={"true"}/>}
                                iconPosition={"right"}
                                title={"Nullstill"}
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
                                    title={"Begrens"}
                                    iconPosition={"right"}
                                    icon={<MagnifyingGlassIcon aria-hidden={"true"}/>}
                                    onClick={() => handleKlikk()}
                                >
                                    Søk
                                </Button>
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}
