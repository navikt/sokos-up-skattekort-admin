import {
    BodyShort,
    Box,
    CopyButton, Heading, HGrid,
    HStack,
    Label,
    Skeleton,
    VStack,
} from "@navikt/ds-react";
import BestilleSkattekortButton from "./BestilleSkattekortButton";
import {useFetchNavn, useFetchSkattekort} from "../api/apiService";
import Soek from "./Soek";
import {useState} from "react";
import ShowSkattekort from "./ShowSkattekort";
import Errorhandler from "./Errorhandler";
import AlertWithCloseButton from "./AlertWithCloseButton";
import LabelText from "./LabelText";
import ShowAuditLogg from "./ShowAuditLogg";

export type ShowPersonProps = {};

function formatterFnr(fnr: string) {
    return `${fnr.substring(0, 6)} ${fnr.substring(6)}`;
}

export default function ShowPerson({}: Readonly<ShowPersonProps>) {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string>("");
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");
    const {data, error, isLoading} = useFetchSkattekort(fnr);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);
    const {
        data: navn,
        error: navnError,
        isLoading: navnIsLoading,
    } = useFetchNavn(fnr);
    return (
        <HGrid gap="space-24" columns={2}>
            <Box margin={"space-24"}>
                <Heading spacing level="3" size="medium">Personinformasjon</Heading>
                <Soek
                    setFnr={setFnr}
                    setIsSubmit={setIsSubmit}
                    isLoading={navnIsLoading}
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
                {navn && (
                    <VStack padding="space-8">
                        {navn && (
                            <Box
                                background={"surface-default"}
                                padding="space-16"
                                paddingInline="space-32"
                                borderRadius="large"
                            >
                                <HStack>
                                    <HStack gap="space-16" align="center">
                                        <BodyShort size="medium">Søkeresultatet gjelder:</BodyShort>
                                        <Label>{navn},</Label>
                                        <Label>{formatterFnr(fnr)}</Label>
                                    </HStack>
                                    <CopyButton
                                        size={"medium"}
                                        copyText={fnr}
                                        iconPosition={"left"}
                                    />
                                </HStack>
                                <Box>{skattekortstatus && (
                                    <LabelText
                                        label={"Skattekort status"}
                                        text={skattekortstatus}
                                    />
                                )}</Box>
                                <BestilleSkattekortButton
                                    gjelderId={fnr}
                                    error={navnError}
                                    setSkattekortstatus={setSkattekortstatus}
                                    setAlertMessage={setAlertMessage}
                                />
                            </Box>
                        )}
                    </VStack>
                )}
                {navnIsLoading && (
                    <VStack padding="space-8">
                        {navnIsLoading && (
                            <Box
                                background={"surface-default"}
                                padding="space-16"
                                borderRadius="large"
                            >
                                <Skeleton variant="text" width="100%"/>
                            </Box>
                        )}
                    </VStack>
                )}
                <ShowSkattekort data={data} isLoading={isLoading}/>
            </Box>
            <ShowAuditLogg fnr={fnr}/>
        </HGrid>
    );
}
