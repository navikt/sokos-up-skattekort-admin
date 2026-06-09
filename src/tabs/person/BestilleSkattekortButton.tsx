import {ExclamationmarkTriangleFillIcon} from "@navikt/aksel-icons";
import {Button, Tooltip} from "@navikt/ds-react";
import {useEffect} from "react";
import type {ForespoerselRequest} from "./api/ForespoerselRequest";
import {bestillSkattekort, useFetchSkattekortStatus} from "./api/api";

interface BestilleSkattekortButtonProps {
	gjelderId: string;
	error: Error | null;
	setSkattekortstatus: (status: string) => void;
	setAlertMessage: (
		message: {
			message: string;
			variant: "success" | "error" | "warning";
		} | null,
	) => void;
    shouldRefreshStatus?: boolean;
    setShouldRefreshStatus: (should: boolean) => void;
}

export default function BestilleSkattekortButton(
	props: Readonly<BestilleSkattekortButtonProps>,
) {
	const request: ForespoerselRequest = {
		personIdent: props.gjelderId,
		aar: new Date().getFullYear(),
		forsystem: "OS",
	};

	const { data } = useFetchSkattekortStatus(request, !!props.shouldRefreshStatus);

	useEffect(() => {
		if (data) {
			props.setSkattekortstatus(data);
			if (
				["IKKE_BESTILT", "BESTILT", "VENTER_PAA_UTSENDING"].includes(
					data,
				)
			) {
				// Det er først når data kommer tilbake fra kallet at vi evt rerendrer basert på shouldRefreshStatus
				// Derfor er det trygt å sette state her uten at vi risikerer en uendelig loop
				props.setShouldRefreshStatus(true);
			} else if (["UGYLDIG_FNR", "KUNSTIG_FNR", "SENDT_FORSYSTEM"].includes(data)) {
				props.setShouldRefreshStatus(false);
			}
            return
		}
        props.setShouldRefreshStatus(false);
	}, [data, props]);

	function handleClick() {
		props.shouldRefreshStatus || props.setShouldRefreshStatus(true);
        
		bestillSkattekort(request)
			.then((response) => {
				if (response.data === "Success") {
					props.setAlertMessage({
						message:
							"Skattekort bestilles fra Skatteetaten. Det tar normalt et par minutter." +
							"Du kan lukke dette vinduet eller fortsette å arbeide i mellomtiden.",
						variant: "success",
					});
				}
			})
			.catch((error) => {
				props.setAlertMessage({ message: error.message, variant: "error" });
			});
	}

	return (
		<Tooltip content={props.error ? props.error.message : "Bestill skattekort"}>
			<span>
				<Button
					size={"small"}
					variant={"secondary-neutral"}
					onClick={handleClick}
					loading={props.shouldRefreshStatus}
					disabled={
						!data ||
						!!props.error ||
						["API_ERROR", "KUNSTIG_FNR", "UGYLDIG_FNR", "SENDT_FORSYSTEM"].includes(
							data ?? "",
						) ||
						props.shouldRefreshStatus
					}
					icon={!!props.error && <ExclamationmarkTriangleFillIcon />}
				>
					Bestill skattekort
				</Button>
			</span>
		</Tooltip>
	);
}
