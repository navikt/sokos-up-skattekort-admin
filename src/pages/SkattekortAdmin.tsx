import {Heading} from "@navikt/ds-react";
import styles from "./SkattekortAdmin.module.css";
import ShowPerson from "../components/ShowPerson";
import GenerellInformasjon from "../components/GenerellInformasjon";

export default function SkattekortAdmin() {
    return (
        <div className={styles.page}>
            <Heading spacing level="2" size="medium">
                Administratorfunksjoner for Skattekort
            </Heading>
            <GenerellInformasjon />
            <ShowPerson />
        </div>
    );
}
