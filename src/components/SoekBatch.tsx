import {zodResolver} from "@hookform/resolvers/zod";
import {EraserIcon, MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {Box, Button, HStack, VStack,} from "@navikt/ds-react";
import {useForm} from "react-hook-form";
import {type BatchInsightRequest, BatchInsightRequestSchema} from "../types/Bestillingsbatch";
import DateTimePicker from "./DateTimePicker";
import {useEffect, useState} from "react";

export type SoekProps = {
    isLoading?: boolean;
    batchInsightRequest: BatchInsightRequest | null;
    handleBatchInsightRequest: (request: BatchInsightRequest) => void;
};

export default function SoekBatch({isLoading, batchInsightRequest, handleBatchInsightRequest}: Readonly<SoekProps>) {

    const [tidspunktFom, setTidspunktFom] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 24))
    const [tidspunktTom, setTidspunktTom] = useState<Date>(new Date(Date.now()))
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<BatchInsightRequest>({
        resolver: zodResolver(BatchInsightRequestSchema),
    });

    useEffect(() => {
        if ( batchInsightRequest?.tidspunktFom) setTidspunktFom(new Date(batchInsightRequest?.tidspunktFom));
        if ( batchInsightRequest?.tidspunktTom) setTidspunktTom(new Date(batchInsightRequest?.tidspunktTom));
    }, [batchInsightRequest]);
    
    function handleSoekReset() {
        setTidspunktFom(new Date(Date.now() - 1000 * 60 * 60 * 24));
        setTidspunktTom(new Date(Date.now()));
        
        reset();
    }
    
    function handleKlikk() {
        handleBatchInsightRequest({tidspunktTom: tidspunktTom.toISOString(), tidspunktFom: tidspunktFom.toISOString()});
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
