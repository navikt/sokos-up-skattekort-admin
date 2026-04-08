import { Heading } from "@navikt/ds-react";
import styles from "./SkattekortAdmin.module.css";
import BestilleSkattekortButton from "../components/BestilleSkattekortButton";
import Soek from "../components/Soek";
import {useState} from "react";
import {useFetchNavn} from "../api/apiService";
import ShowName from "../components/ShowName";

export default function SkattekortAdmin() {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [fnr, setFnr] = useState<string>("");
    const [skattekortstatus, setSkattekortstatus] = useState<string>("UKJENT");
    const {
        data: navn,
        error: navnError,
        isLoading: navnIsLoading,
    } = useFetchNavn(fnr);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        variant: "success" | "error" | "warning";
    } | null>(null);

    return (
			<div className={styles.page}>
				<Heading spacing level="2" size="medium">
					Skattekort Administrator
				</Heading>
                <Soek
                    setFnr={setFnr}
                    setIsSubmit={setIsSubmit}
                    isLoading={navnIsLoading}
                />
                <BestilleSkattekortButton
                    gjelderId={fnr}
                    error={navnError}
                    setSkattekortstatus={setSkattekortstatus}
                    setAlertMessage={setAlertMessage}
                />
                <ShowName fnr={fnr} navn={navn} navnIsLoading={navnIsLoading} />
			</div>
	);
}
