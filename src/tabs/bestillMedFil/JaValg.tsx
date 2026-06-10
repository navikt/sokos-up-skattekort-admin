import {HStack} from "@navikt/ds-react";
import UtsendingModal from "./UtsendingModal";
import {type Dispatch, type SetStateAction, useState} from "react";
import SimpleOpprettAbonnementModal from "./SimpleOpprettAbonnementModal";
import Statusikon, {StatusikonType} from "./Statusikon";
import type {Forsystem} from "./api/FlereFnrRequest";

interface JaValgProps {
    fnr: string,
    inntektsaar: number,
    abonnementer: string[],
    setAlertMessages: Dispatch<SetStateAction<{ message: string, variant: "success" | "error" | "warning" }[]>>;
}

export default function JaValg({fnr, inntektsaar, abonnementer, setAlertMessages}: Readonly<JaValgProps>) {
    const [utsend, setUtsend] = useState<Set<Forsystem>>(new Set);
    const [abonner, setAbonner] = useState<Set<string>>(new Set);
    const [kunneIkkeAbonnere, setKunneIkkeAbonnere] = useState<Set<string>>(new Set);
    const [kunneIkkeSende, setKunneIkkeSende] = useState<Set<string>>(new Set);

    return (<HStack>
        {"Ja("}
        <UtsendingModal fnr={fnr} inntektsaar={inntektsaar} alreadySent={utsend} setSendes={setUtsend} setKunneIkkeSende={setKunneIkkeSende}/>
        {"|"}
        <SimpleOpprettAbonnementModal 
            setAlertMessages={setAlertMessages}
            fnr={fnr} inntektsaar={inntektsaar} 
            abonnementer={[...abonnementer, ...abonner]} 
            setAbonner={setAbonner} setFailed={setKunneIkkeAbonnere}/>
        {")"}
        <Statusikon showIcon={utsend.size > 0} 
                    title={`Startet utsending til ${[...utsend].join(", ")}`} 
                    type={StatusikonType.SENDING}/>
        <Statusikon showIcon={kunneIkkeSende.size > 0} 
                    title={`Utsending til ${[...kunneIkkeSende].join(", ")} feilet, sjekk logg og network-tab`} 
                    type={StatusikonType.SENDTROUBLE} />        
        <Statusikon showIcon={abonner.size > 0} 
                    title={`Startet abonnement for ${[...abonner].join(", ")}`} 
                    type={StatusikonType.SUBSCRIBE} />        
        <Statusikon showIcon={kunneIkkeAbonnere.size > 0} 
                    title={`Utsending til ${[...kunneIkkeAbonnere].join(", ")} feilet, sjekk logg og network-tab`} 
                    type={StatusikonType.SUBSCRIBETROUBLE} />        
    </HStack>)
}