import {Box, Heading, HGrid, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import {useFetchSkattekort} from "../api/apiService";
import AlertWithCloseButton from "../components/AlertWithCloseButton";
import Errorhandler from "../components/Errorhandler";
import ShowAuditLogg from "../components/ShowAuditLogg";
import ShowSkattekort from "../components/ShowSkattekort";
import Soek from "../components/Soek";
import LabelText from "../components/LabelText";
import BestilleSkattekortButton from "../components/BestilleSkattekortButton";

export default function Person() {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string>("");
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
                    setFnr={setFnr}
                    setIsSubmit={setIsSubmit}
                    isLoading={isLoading}
                />
                <Errorhandler error={error}/>
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
                            <Box
                                background={"surface-default"}
                                padding="space-16"
                                paddingInline="space-32"
                                borderRadius="large"
                            >
                                <Box>
                                    {skattekortstatus && (<LabelText
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
                    </VStack>
                <ShowSkattekort data={data} isLoading={isLoading}/>
            </Box>
            <ShowAuditLogg fnr={fnr}/>
        </HGrid>
    );
}
