import {ExclamationmarkTriangleFillIcon} from "@navikt/aksel-icons";
import {Button, Tooltip} from "@navikt/ds-react";
import type {ForespoerselRequest} from "./api/ForespoerselRequest";
import {bestillSkattekort, useFetchSkattekortStatus} from "./api/api";
import {useEffect, useRef} from "react";
import type {Alert} from "../../common/AlertWithCloseButton";
import type {SokParameter} from "./SokParameter";

interface BestilleSkattekortButtonProps {
    sokParameters: SokParameter;
    error: Error | null;
    setSkattekortstatus: (status: string) => void;
    addAlertMessage: (alert: Alert) => void;
    shouldRefreshStatus?: boolean;
    setShouldRefreshStatus: (should: boolean) => void;
}

export default function BestilleSkattekortButton(
    props: Readonly<BestilleSkattekortButtonProps>,
) {
    const request: ForespoerselRequest = {
        personIdent: props.sokParameters.fnr,
        aar: Number(props.sokParameters.aar),
        forsystem: props.sokParameters.forsystem,
    };
    const cooldownTimerRef = useRef<number>(null);
    const {data: status, error} = useFetchSkattekortStatus(request, !!props.shouldRefreshStatus);

    useEffect(() => {
        if (status) {
            props.setSkattekortstatus(status);
            if (![
                "ABONNERER_IKKE",
                "IKKE_FORESPURT", 
                "IKKE_BESTILT", 
                "BESTILT", 
                "VENTER_UTSENDING"].includes(status)) {
                if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);

                cooldownTimerRef.current = setTimeout(() => {
                    props.setShouldRefreshStatus(false);
                }, 5000);
            }
        }

        return () => {
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }
        };
    }, [status, props.setShouldRefreshStatus, props.setSkattekortstatus]);

    function handleClick() {
        props.shouldRefreshStatus || props.setShouldRefreshStatus(true);
        bestillSkattekort(request)
            .then((response) => {
                if (response.data === "Success") {
                    props.addAlertMessage({
                        message: `Skattekort er forespurt til ${props.sokParameters.forsystem} for ${props.sokParameters.aar}`,
                        variant: "success",
                    });
                }
            })
            .catch((error) => {
                props.addAlertMessage({message: error.message, variant: "error"});
            });
    }

    return (
        <Tooltip content={"Send forespørsel til sokos-skattekort om Skattekort"}>
			<span>
                {JSON.stringify(error, null, 2)}
				<Button
                    size={"small"}
                    onClick={handleClick}
                    loading={props.shouldRefreshStatus}
                    disabled={
                        !status ||
                        [
                            "IKKE_BESTILT",
                            "BESTILT",
                            "VENTER_UTSENDING",
                        ].includes(status) ||
                        props.shouldRefreshStatus
                    }
                    icon={!!props.error && <ExclamationmarkTriangleFillIcon/>}
                >
					Forespør
                    {status === "ABONNERER" && " igjen"}
				</Button>
			</span>
        </Tooltip>
    )

}