import {ExclamationmarkTriangleFillIcon} from "@navikt/aksel-icons";
import {Button, Tooltip} from "@navikt/ds-react";
import type {ForespoerselRequest} from "./api/ForespoerselRequest";
import {bestillSkattekort, useFetchSkattekortStatus} from "./api/api";
import {useEffect} from "react";
import {Alert} from "../../common/AlertWithCloseButton";
import {SokParameter} from "./SokParameter";

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

    const {data: status} = useFetchSkattekortStatus(request, !!props.shouldRefreshStatus);

    useEffect(() => {
        console.log("Skattekortstatus:", status);
        if (status) {
            props.setSkattekortstatus(status);
            if (!["IKKE_FORESPURT", 
                "IKKE_BESTILT", 
                "BESTILT", 
                "VENTER_PAA_UTSENDING"].includes(status)) {
                props.setShouldRefreshStatus(false);
            }
            return
        }
        props.setShouldRefreshStatus(false);
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
				<Button
                    size={"small"}
                    onClick={handleClick}
                    loading={props.shouldRefreshStatus}
                    disabled={
                        !status || props.shouldRefreshStatus
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