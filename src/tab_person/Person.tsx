import {Box, Heading, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import AlertWithCloseButton from "../common/AlertWithCloseButton";
import Errorhandler from "../common/Errorhandler";
import ShowAuditLogg from "./ShowAuditLogg";
import Soek from "./Soek";
import LabelText from "../common/LabelText";
import BestilleSkattekortButton from "./BestilleSkattekortButton";
import {useFetchSkattekort} from "./api";

export type PersonProps = {
    fnr: string | null;
    handleShowBatchesAt: (date: Date) => void;
}

export default function Person(props: Readonly<PersonProps>) {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string | null>(props.fnr);
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");

    const {data: skattekortData, error, isLoading} = useFetchSkattekort(fnr);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    return (
        <Box marginInline={"auto"} padding="space-16" width="100%" maxWidth="1440px">
            <Heading spacing level="3" size="medium">Personinformasjon</Heading>
            <Soek
                fnr={fnr}
                setFnr={setFnr}
                setIsSubmit={setIsSubmit}
                isLoading={isLoading}
                nullstillStatus={() => setSkattekortstatus("UKJENT")}
            />
            <Errorhandler heading={"Feil ved henting av person:"} error={error}/>
            {!!alertMessage && (
                <AlertWithCloseButton
                    show={!!alertMessage}
                    setShow={() => setAlertMessage(null)}
                    variant={alertMessage.variant}
                >
                    {alertMessage.message}
                </AlertWithCloseButton>
            )}
            <VStack padding="space-8">
                {!error && fnr && <Box
                    background={"surface-default"}
                    padding="space-16"
                    paddingInline="space-32"
                    borderRadius="large"
                >
                    <Box>
                        {skattekortstatus && fnr && (<LabelText
                                label={"Skattekort status"}
                                text={skattekortstatus}
                            />
                        )}
                    </Box>
                    <BestilleSkattekortButton
                        gjelderId={fnr}
                        error={error}
                        setSkattekortstatus={setSkattekortstatus}
                        setAlertMessage={setAlertMessage}
                        shouldRefreshStatus={shouldRefresh}
                        setShouldRefreshStatus={setShouldRefresh}
                    />
                </Box>
                }
                {fnr &&
                    <ShowAuditLogg shouldRefresh={shouldRefresh} fnr={fnr} skattekort={skattekortData}
                                   jumpToBatches={props.handleShowBatchesAt}/>}
            </VStack>
        </Box>
    );
}
