import {Box, Heading, HGrid, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import {useFetchSkattekort} from "../api/apiService";
import AlertWithCloseButton from "../components/AlertWithCloseButton";
import Errorhandler from "../components/Errorhandler";
import ShowAuditLoggAlt2 from "../components/ShowAuditLoggAlt2";
import ShowSkattekort from "../components/ShowSkattekort";
import Soek from "../components/Soek";
import LabelText from "../components/LabelText";
import BestilleSkattekortButton from "../components/BestilleSkattekortButton";
import ShowAuditLogg from "../components/ShowAuditLogg";

export type PersonProps = {
    fnr: string|null;
    handleShowBatchesAt: (date: Date) => void;
}

export default function Person(props: Readonly<PersonProps>) {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string|null>(props.fnr);
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");
    
    const {data, error, isLoading} = useFetchSkattekort(fnr);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);
    return (
        <HGrid gap="space-24" columns={2}>
            <Box margin={"space-24"}>
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
                        {fnr && <Box
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
                                />
                            </Box>
                        }
                    </VStack>
                <ShowSkattekort data={data} isLoading={isLoading} jumpToBatches={props.handleShowBatchesAt}/>
            </Box>
            {fnr && <ShowAuditLogg fnr={fnr} jumpToBatches={props.handleShowBatchesAt}/>}
        </HGrid>
    );
}
