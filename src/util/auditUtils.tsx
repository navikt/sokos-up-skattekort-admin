import type {Periode} from "./listUtils";
import {type Skattekort, SkattekortResponseDTOSchema} from "../tabs/person/api/SkattekortResponseDTOSchema";
import {type Audit, AuditSchema} from "../tabs/person/api/Audit";
import {
    BagdeIcon,
    BookmarkDashIcon,
    ChatExclamationmarkFillIcon,
    ClipboardCheckmarkIcon,
    ClipboardIcon,
    InboxDownIcon,
    InboxUpIcon,
    NotePencilIcon,
    PersonCrossFillIcon,
    PersonGavelIcon,
    PersonPencilIcon,
    PersonPlusIcon,
    PersonSuitIcon,
    PhoneSlashFillIcon,
    QuestionmarkCircleIcon,
    RobotIcon,
    XMarkOctagonFillIcon
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
                Ikon = ChatExclamationmarkFillIcon;
                break;
            case "BESTILLING_SENDT":
                Ikon = ClipboardCheckmarkIcon;
                break;
            case "HENTING_AV_SKATTEKORT_FEILET":
                Ikon = XMarkOctagonFillIcon;
                break;
            case "INVALID_FNR":
                Ikon = PersonCrossFillIcon;
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
                Ikon = RobotIcon;
                break;
            case "UKJENT":
                Ikon = QuestionmarkCircleIcon;
                break;
            case "UTSENDING_FEILET":
                Ikon = PhoneSlashFillIcon;
                break;
            case "UTSENDING_OK":
                Ikon = InboxUpIcon;
                break;
            case "UVENTET_PERSON":
                Ikon = PersonSuitIcon;
                break;
            case "MANUELL":
                Ikon = NotePencilIcon;
                break;
            case "BESTILLING_ETTERLATT":
                Ikon = BookmarkDashIcon
                break;
        }
    }
    return <Ikon aria-label={tooltiptext}/>
}
