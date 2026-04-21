import {Heading} from "@navikt/ds-react";
import styles from "./SkattekortAdmin.module.css";
import ShowPerson from "../components/ShowPerson";
import BestillingsbatchInformasjon from "../components/BestillingsbatchInformasjon";

export default function SkattekortAdmin() {
    return (
        <div className={styles.page}>
            <Heading spacing level="2" size="medium">
                Administratorfunksjoner for Skattekort
            </Heading>
            <Heading size={"medium"} spacing>Generell informasjon</Heading>
            <BestillingsbatchInformasjon />
            <Heading size={"medium"} spacing>Personspesifikk informasjon</Heading>
            <ShowPerson />
        </div>
    );
}
