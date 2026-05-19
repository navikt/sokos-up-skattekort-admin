import {Box, Heading,} from "@navikt/ds-react";
import {useState} from "react";
import AlertWithCloseButton from "../components/AlertWithCloseButton";
import SoekFlere from "../components/SoekFlere";

export type PersonProps = {
    fnr: string[];
    handleShowBatchesAt: (date: Date) => void;
}

export default function Personer(props: Readonly<PersonProps>) {

    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);


    return (
        <Box marginInline={"auto"} padding="space-16" width="100%" maxWidth="1440px">
            <Heading spacing level="3" size="medium">Personinformasjon</Heading>
            <SoekFlere />
            {!!alertMessage && (
                <AlertWithCloseButton
                    show={!!alertMessage}
                    setShow={() => setAlertMessage(null)}
                    variant={alertMessage.variant}
                >
                    {alertMessage.message}
                </AlertWithCloseButton>
            )}
        </Box>
    );
}
