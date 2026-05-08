import {ExpansionCard} from "@navikt/ds-react";
import {type Skattekort, skattekortTittel} from "../types/SkattekortResponseDTOSchema";
import {toLocalDate} from "../util/dateUtils";
import Skattekortdata from "./Skattekortdata";

export type VisSkattekortProps = {
    skattekort: Skattekort;
    open?: boolean;
    jumpToBatches: (date: Date) => void;
};

export default function VisSkattekort({skattekort, open, jumpToBatches}: Readonly<VisSkattekortProps>) {
    return <ExpansionCard defaultOpen={!!open} aria-label="Skattekort">
        <ExpansionCard.Header>
            <ExpansionCard.Title as="h4" size="small">
                {skattekortTittel(skattekort)} {skattekort.inntektsaar}.{" "}
                {(skattekort.utstedtDato ?? "") !== "" &&
                    `Utstedt ${toLocalDate(skattekort.utstedtDato ?? "")}`}
            </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
            <Skattekortdata skattekort={skattekort} jumpToBatches={jumpToBatches}/>
        </ExpansionCard.Content>
    </ExpansionCard>
}