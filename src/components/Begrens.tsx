import { zodResolver } from "@hookform/resolvers/zod";
import { EraserIcon, MagnifyingGlassIcon } from "@navikt/aksel-icons";
import {
	Box,
	Button,
	HelpText,
	HStack,
	TextField,
	VStack,
} from "@navikt/ds-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { type SokParameter, SokParameterSchema } from "../types/SokParameter";
import {BatchInsightRequest, BatchInsightRequestSchema} from "../types/Bestillingsbatch";

export type SoekProps = {
	setIsSubmit: (isSubmit: boolean) => void;
    setTidspunktFom: (datoFom: string) => void;
    setTidspunktTom: (datoTom: string) => void;
    isLoading?: boolean;
};
function formaterFnr(fnr: string) {
	return fnr.replaceAll(/\D/g, "");
}

//TODO Under construction
export default function Begrens({setIsSubmit, setTidspunktFom, setTidspunktTom, isLoading,}: Readonly<SoekProps>) {
	const {
		register,
		handleSubmit,
		trigger,
		reset,
		setValue,
		formState: { errors },
	} = useForm<BatchInsightRequest>({
		resolver: zodResolver(BatchInsightRequestSchema),
	});

	function handleSoekReset() {
		setIsSubmit(false);
        setTidspunktFom("");
        setTidspunktTom("");
		reset();
	}
	function handleBegrensSubmit(parameter: BatchInsightRequest) {
		setIsSubmit(true);
		const datoFom = parameter.tidspunktFom ?? "";
	}
	return (
		<Box padding="6" background={"surface-alt-1-subtle"} borderRadius="large">
			<form onSubmit={handleSubmit(handleBegrensSubmit)}>
				<VStack gap={"4"}>
					<HStack justify="space-between">
						<TextField
							{...register("tidspunktFom")}
							size={"small"}
							autoComplete={"off"}
							htmlSize={30}
							maxLength={18}
							label="Tidspunkt FOM"
							error={errors.tidspunktFom?.message}
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus
						/>
                        <TextField
                            {...register("tidspunktFom")}
                            size={"small"}
                            autoComplete={"off"}
                            htmlSize={30}
                            maxLength={18}
                            label="Tidspunkt TOM"
                            error={errors.tidspunktTom?.message}
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                        />
						<HelpText placement="left" title="Om arbeidsflaten skattekort">
							Du kan se skattekort 24 mnd tilbake i tid.
							<br />
							For å se hvilken del av skattekortet som vil bli, eller er, brukt
							i en beregning må menypunktet "Skatt og trekk" og underpunktmeny
							"eSkattekort - Søk" i Økonomiportalen benyttes.
						</HelpText>
					</HStack>
					<HStack gap="space-16" justify="end">
						<Button
							disabled={isLoading}
							variant="secondary"
							size={"small"}
							type="button"
							icon={<EraserIcon aria-hidden={"true"} />}
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
							icon={<MagnifyingGlassIcon aria-hidden={"true"} />}
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
