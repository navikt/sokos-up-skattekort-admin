import {HStack} from "@navikt/ds-react";
import {type Dispatch, type SetStateAction, useState} from "react";
import SimpleOpprettAbonnementModal from "./SimpleOpprettAbonnementModal";
import Statusikon, {StatusikonType} from "./Statusikon";

interface NeiValgProps {
    fnr: string,
    inntektsaar: number,
    abonnementer: string[],
    setAlertMessages: Dispatch<SetStateAction<{ message: string, variant: "success" | "error" | "warning" }[]>>;
}

export default function NeiValg({fnr, inntektsaar, abonnementer, setAlertMessages}: Readonly<NeiValgProps>) {
    const [abonner, setAbonner] = useState<Set<string>>(new Set);
    const [failed, setFailed] = useState<Set<string>>(new Set);

    return (<HStack>
        {"Nei("}
        <SimpleOpprettAbonnementModal setAlertMessages={setAlertMessages} fnr={fnr} inntektsaar={inntektsaar} abonnementer={[...abonnementer, ...abonner]} setAbonner={setAbonner} setFailed={setFailed}/>
        {")"}
        <Statusikon showIcon={abonner.size > 0} title={`Startet abonnement for ${[...abonner].join(", ")}`} type={StatusikonType.SUBSCRIBE} />        
        <Statusikon showIcon={failed.size > 0} title={`${[...failed].join(", ")} feilet, sjekk logg og network-tab`} type={StatusikonType.TROUBLE} />        
    </HStack>)
}