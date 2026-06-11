import {Box, Heading, HStack, VStack,} from "@navikt/ds-react";
import {useEffect, useState} from "react";
import AlertWithCloseButton, {Alert} from "../../common/AlertWithCloseButton";
import Errorhandler from "../../common/Errorhandler";
import ShowAuditLogg from "./ShowAuditLogg";
import Soek from "./Soek";
import LabelText from "../../common/LabelText";
import BestilleSkattekortButton from "./BestilleSkattekortButton";
import {useFetchSkattekort} from "./api/api";
import {SokParameter} from "./SokParameter";
import {thisYear} from "../../util/dateUtils";

export type PersonProps = {
    fnr: string | null;
    handleShowBatchesAt: (date: Date) => void;
}

export default function Person(props: Readonly<PersonProps>) {
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");
    const [sokParameters, setSokParameters] =
        useState<SokParameter>({fnr: "", aar: thisYear(), forsystem: "OS"});

    const {data: skattekortData, error, isLoading} = useFetchSkattekort(sokParameters.fnr);
    const [alertMessages, setAlertMessages] = useState<Set<Alert>>(new Set());
    useEffect(() => {
        if (props.fnr) {
            setSokParameters(prev =>
                ({fnr: props.fnr || "", aar: prev.aar, forsystem: prev.forsystem}))
        }}, [props.fnr, setSokParameters]);

    function addAlertMessage(alert: Alert) {
        return setAlertMessages(prev => new Set(prev).add(alert));
    }

    const [shouldRefresh, setShouldRefresh] = useState(false);

    return (
        <Box marginInline={"auto"} padding="space-16" width="100%" maxWidth="1440px">
            <Heading spacing level="3" size="medium">Personinformasjon</Heading>
            <Soek
                fnr={sokParameters.fnr}
                setSokparametre={setSokParameters}
                isLoading={isLoading}
                nullstillStatus={() => {
                    setSokParameters({fnr: "", aar: thisYear(), forsystem: "OS"});
                    setSkattekortstatus("UKJENT");
                }}
            />
            <Errorhandler heading={"Feil ved henting av person:"} error={error}/>
            {alertMessages.size > 0 && [...alertMessages].map((alertMessage) => (
                    <AlertWithCloseButton
                        key={alertMessage.message}
                        show={alertMessages.size > 0}
                        setShow={() => setAlertMessages(new Set())}
                        variant={alertMessage.variant}
                    >
                        {alertMessage.message}
                    </AlertWithCloseButton>
                )
            )}
            {sokParameters.fnr && <Box
                background={"surface-default"}
                padding="space-16"
                paddingInline="space-32"
                borderRadius="large"
            >
                <VStack justify="space-between" align={"baseline"} gap={"space-16"}>
                    <HStack gap={"space-32"} align={"center"}>
                        {skattekortstatus && sokParameters.fnr && (<LabelText
                                label={`Skattekort status for ${sokParameters.fnr}, ${sokParameters.forsystem}, ${sokParameters.aar}`} 
                                text={skattekortstatus}
                            />
                        )}
                        <BestilleSkattekortButton
                            sokParameters={sokParameters}
                            error={error}
                            setSkattekortstatus={setSkattekortstatus}
                            addAlertMessage={addAlertMessage}
                            shouldRefreshStatus={shouldRefresh}
                            setShouldRefreshStatus={setShouldRefresh}
                        />
                    </HStack>
                </VStack>
            </Box>
            }
            {sokParameters.fnr &&
                <ShowAuditLogg shouldRefresh={shouldRefresh} fnr={sokParameters.fnr} skattekort={skattekortData}
                               jumpToBatches={props.handleShowBatchesAt}/>}
        </Box>
    );
}
