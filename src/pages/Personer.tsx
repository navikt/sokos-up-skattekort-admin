import {Box, Heading, VStack,} from "@navikt/ds-react";
import {useState} from "react";
import {useFetchSkattekort} from "../api/apiService";
import AlertWithCloseButton from "../components/AlertWithCloseButton";
import Errorhandler from "../components/Errorhandler";
import ShowAuditLogg from "../components/ShowAuditLogg";
import Soek from "../components/Soek";
import LabelText from "../components/LabelText";
import BestilleSkattekortButton from "../components/BestilleSkattekortButton";
import SoekFlere from "../components/SoekFlere";

export type PersonProps = {
    fnr: string[];
    handleShowBatchesAt: (date: Date) => void;
}

export default function Personer(props: Readonly<PersonProps>) {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string[]>(props.fnr);
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");

    const {data: skattekortData, error, isLoading} = {data:null, error:null, isLoading:false}//useFetchFlereFnr(fnr);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    return (
        <Box marginInline={"auto"} padding="space-16" width="100%" maxWidth="1440px">
            <Heading spacing level="3" size="medium">Personinformasjon</Heading>
            <SoekFlere
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
                        gjelderId={fnr[0]}
                        error={error}
                        setSkattekortstatus={setSkattekortstatus}
                        setAlertMessage={setAlertMessage}
                        shouldRefreshStatus={shouldRefresh}
                        setShouldRefreshStatus={setShouldRefresh}
                    />
                </Box>
                }
                {fnr && skattekortData &&
                    <ShowAuditLogg shouldRefresh={shouldRefresh} fnr={fnr[0]} skattekort={skattekortData} jumpToBatches={props.handleShowBatchesAt} />}
            </VStack>
        </Box>
    );
}
