import {BodyLong, Box, Button, Checkbox, CheckboxGroup, HStack, Modal, VStack} from "@navikt/ds-react";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {bestillSkattekort} from "../person/api/api";

interface SimpleOpprettAbonnementModalProps {
    fnr: string;
    abonnementer: string[];
    inntektsaar: number;
    setAbonner: Dispatch<SetStateAction<Set<string>>>
    setFailed: Dispatch<SetStateAction<Set<string>>>
}

export default function SimpleOpprettAbonnementModal({fnr, abonnementer, inntektsaar, setAbonner, setFailed}: Readonly<SimpleOpprettAbonnementModalProps>) {
    const ref = useRef<HTMLDialogElement>(null);
    const [forsystemer, setForsystemer] = useState<string[]>([]);
    const handleClick = () => {
        ref.current?.showModal();
    };
    function handleClose() {
        ref.current?.close();
    }
    
    async function handleOpprettAbonnement() {
        const abonnerNow: string[] = [] as string[];
        const failedNow: string[] = [] as string[];
            for (const forsystem of forsystemer) {
                const abonnementString = `${forsystem}${inntektsaar}`
                if (!abonnementer.includes(abonnementString)) {
                    await bestillSkattekort({personIdent: fnr, aar: inntektsaar, forsystem})
                        .then(() => {
                            abonnerNow.push(abonnementString);
                        })
                        .catch(() => {
                            failedNow.push(abonnementString);
                        })
                }
        }
        setAbonner((prev) => new Set([...prev, ...abonnerNow]));
        setFailed((prev) => new Set([...prev, ...failedNow]));
        handleClose();
    }
    
    const alreadyExistAbonnement = 
        new Set(abonnementer.filter(abo => abo.endsWith(inntektsaar.toString())).map(abo => abo.replace(inntektsaar.toString(), "")))

    const checkboxes =
        ["OS", "OS_STOR", "DARE_POC"]
            .map(forsystem => <Checkbox readOnly={alreadyExistAbonnement.has(forsystem)} key={forsystem} value={forsystem}>{forsystem}</Checkbox>)
    
    return (
        <Box>
            <Button size="xsmall" variant={"tertiary"} onClick={handleClick}>
                Opprett abonnement
            </Button>

            <Modal ref={ref} header={{heading: `Opprett abonnement`}}>
                <Modal.Body>
                    <VStack gap={"space-16"}>
                        <BodyLong>
                            Opprett abonnement for {fnr} for inntektsåret {inntektsaar}
                        </BodyLong>
                        <HStack gap="space-8" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} onChange={setForsystemer}>
                                {checkboxes}
                            </CheckboxGroup>
                        </HStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleOpprettAbonnement}>Opprett abonnement</Button>
                    <Button variant={"secondary"} onClick={handleClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </Box>
    )
}