import {Box, Heading, HStack, Switch, VStack,} from "@navikt/ds-react";
import {useEffect, useState} from "react";
import AlertWithCloseButton, {type Alert} from "../../common/AlertWithCloseButton";
import Errorhandler from "../../common/Errorhandler";
import ShowAuditLogg from "./ShowAuditLogg";
import Soek from "./Soek";
import LabelText from "../../common/LabelText";
import BestilleSkattekortButton from "./BestilleSkattekortButton";
import {useFetchSkattekort} from "./api/api";
import type {SokParameter} from "./SokParameter";
import {thisYear} from "../../util/dateUtils";

export type PersonProps = {
    fnr: string | null;
    handleShowBatchesAt: (date: Date) => void;
}

export default function Person(props: Readonly<PersonProps>) {
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");
    const [sokParameters, setSokParameters] =
        useState<SokParameter>({fnr: "", aar: thisYear(), forsystem: "OS"});

    const [refreshingAfterBestilling, setRefreshingAfterBestilling] = useState<boolean>(false);
    const [refreshSwitch, setRefreshSwitch] = useState<boolean>(false);
    
    const refreshRate = refreshingAfterBestilling ? 1000 
                            : refreshSwitch ? 5000 
                            : 0;
    
    const {data: skattekortData, error, isLoading} = useFetchSkattekort(sokParameters.fnr, refreshRate);
    const [alertMessages, setAlertMessages] = useState<Set<Alert>>(new Set());
    useEffect(() => {
        if (props.fnr) {
            setSokParameters(prev =>
                ({fnr: props.fnr || "", aar: prev.aar, forsystem: prev.forsystem}))
        }}, [props.fnr]);

    function addAlertMessage(alert: Alert) {
        setAlertMessages(prev => {
            if ([...prev].some(a => a.message === alert.message)) return prev;
            else return new Set(prev).add(alert);
    })}


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
            <Switch
                value="live"
                checked={refreshSwitch}
                onChange={e =>
                    setRefreshSwitch((x) => (x ? false : e.target.value === "live"))}
            > Automatisk oppdatering av data</Switch>
            <Errorhandler fetchSubject={"skattekort:"} error={error} emptyResponse={skattekortData?.length===0}/>
            {(alertMessages.size > 0) && [...alertMessages].map((alertMessage) => (
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
                            shouldRefreshStatus={refreshRate}
                            setAwaitingFinalStatus={setRefreshingAfterBestilling}
                        />
                    </HStack>
                </VStack>
            </Box>
            }
            {sokParameters.fnr &&
                <ShowAuditLogg refreshRate={refreshRate} fnr={sokParameters.fnr} skattekort={skattekortData}
                               jumpToBatches={props.handleShowBatchesAt}/>}
        </Box>
    );
}
