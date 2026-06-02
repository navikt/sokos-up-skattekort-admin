import {BodyLong, Box, Button, Checkbox, CheckboxGroup, HStack, Modal, VStack} from "@navikt/ds-react";
import {useRef, useState} from "react";
import {bestillSkattekort} from "../person/api/api";

interface OpprettAbonnementModalProps {
    fnr: string;
    abonnementer: string[];
}

export default function OpprettAbonnementModal({fnr, abonnementer}: Readonly<OpprettAbonnementModalProps>) {
    const ref = useRef<HTMLDialogElement>(null);

    const [forsystemer, setForsystemer] = useState<string[]>([]);
    const [aar, setAar] = useState<number[]>([]);

    const handleClick = () => {
        ref.current?.showModal();
    };
    const thisYear = new Date().getFullYear()
    
    const [abonner, setAbonner] = useState(abonnementer);
    const [failed, setFailed] = useState<string[]>([]);

    function handleClose() {
        ref.current?.close();
    }
    
    function handleOpprettAbonnement() {
        const abonnerNow: string[] = [] as string[];
        const failedNow: string[] = [] as string[];
        for (const year of aar) {
            for (const forsystem of forsystemer) {
                const abonnementString = `${forsystem}${year}`
                if (abonnementer.includes(abonnementString)) {
                    failedNow.push(abonnementString);
                } else {
                    bestillSkattekort({personIdent: fnr, aar: year, forsystem})
                        .then(() => {
                            abonnerNow.push(abonnementString);
                        })
                        .catch(() => {
                            failedNow.push(abonnementString);
                        })
                }
            }
        }
        setAbonner((prev) => [...new Set([...prev, ...abonnerNow])])
        setFailed((prev) => [...new Set([...prev, ...failedNow])]);
        handleClose()
    }
    
    return (
        <Box>
            <Button size="xsmall" variant={"tertiary"} onClick={handleClick}>
                Opprett abonnement
            </Button>

            <Modal ref={ref} header={{heading: `Opprett abonnement`}}>
                <Modal.Body>
                    <VStack gap={"space-16"}>
                        <BodyLong>
                            Opprett abonnement for {fnr}
                        </BodyLong>
                        <HStack gap="space-8" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} onChange={setForsystemer}>
                                <Checkbox value={"OS"}>OS</Checkbox>
                                <Checkbox value={"OS_STOR"}>OS_STOR</Checkbox>
                                <Checkbox value={"DARE_POC"}>DARE_POC</Checkbox>
                            </CheckboxGroup>
                            <CheckboxGroup legend={"År"} onChange={setAar}>
                                <Checkbox key={thisYear - 1} value={thisYear - 1}>{thisYear - 1}</Checkbox>
                                <Checkbox key={thisYear} value={thisYear}>{thisYear}</Checkbox>
                                <Checkbox key={thisYear + 1} value={thisYear + 1}>{thisYear + 1}</Checkbox>
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