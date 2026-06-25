import type {Periode} from "./listUtils";
import {type Skattekort, SkattekortResponseDTOSchema} from "../tabs/person/api/SkattekortResponseDTOSchema";
import {type Audit, AuditSchema} from "../tabs/person/api/Audit";
import {
    BagdeIcon,
    BroadcastMinusCircleIcon, ChatCheckmarkIcon,
    ChatExclamationmarkIcon, ClipboardIcon, ClipboardLinkIcon, InboxDownIcon,
    InboxUpIcon, LaptopTriangleIcon, PencilWritingIcon,
    PersonCrossIcon, PersonGavelIcon, PersonPencilIcon, PersonPlusIcon, PersonSuitIcon, QuestionmarkCircleIcon,
    RobotFrownIcon
} from "@navikt/aksel-icons";

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
export function isAnAudit(periode: Periode<any>): periode is Periode<Audit> {
    return AuditSchema.safeParse(periode.item).success
}

// biome-ignore lint/suspicious/noExplicitAny: Dette er en metode for å sjekke type
export function isASkattekort(periode: Periode<any>): periode is Periode<Skattekort> {
    return SkattekortResponseDTOSchema.safeParse(periode.item).success
}


export function ikon(hendelse:Periode<Skattekort | Audit>, dato: string) {
    let tooltiptext = ""
    let Ikon = BagdeIcon

    if (isASkattekort(hendelse)) {
        tooltiptext = "Skattekort"
        Ikon = BagdeIcon
    }
    else if (isAnAudit(hendelse)) {
        tooltiptext = hendelse.item.tag
        switch(hendelse.item.tag) {
            case "BESTILLING_FEILET":
                Ikon = ChatExclamationmarkIcon;
                break;
            case "BESTILLING_SENDT":
                Ikon = InboxUpIcon;
                break;
            case "HENTING_AV_SKATTEKORT_FEILET":
                Ikon = BroadcastMinusCircleIcon;
                break;
            case "INVALID_FNR":
                Ikon = PersonCrossIcon;
                break;
            case "MOTTATT_FORESPOERSEL":
                Ikon = ClipboardIcon;
                break;
            case "NYTT_FNR":
                Ikon = PersonGavelIcon;
                break;
            case "OPPDATERT_PERSONIDENTIFIKATOR":
                Ikon = PersonPencilIcon;
                break;
            case "OPPRETTET_PERSON":
                Ikon = PersonPlusIcon;
                break;
            case "SKATTEKORTINFORMASJON_MOTTATT":
                Ikon = InboxDownIcon;
                break;
            case "SYNTETISERT_SKATTEKORT":
                Ikon = ClipboardLinkIcon;
                break;
            case "UKJENT":
                Ikon = QuestionmarkCircleIcon;
                break;
            case "UTSENDING_FEILET":
                Ikon = LaptopTriangleIcon;
                break;
            case "UTSENDING_OK":
                Ikon = ChatCheckmarkIcon;
                break;
            case "UVENTET_PERSON":
                Ikon = PersonSuitIcon;
                break;
            case "MANUELL":
                Ikon = PencilWritingIcon;
                break;
            case "BESTILLING_ETTERLATT":
                Ikon = RobotFrownIcon
                break;
        }
    }
    return <Ikon aria-label={tooltiptext}/>
}
