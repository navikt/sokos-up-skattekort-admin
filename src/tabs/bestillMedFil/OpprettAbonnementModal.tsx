import {BodyLong, Box, Button, Checkbox, CheckboxGroup, HStack, Modal, VStack} from "@navikt/ds-react";
import {Dispatch, type SetStateAction, useRef, useState} from "react";
import {bestillSkattekort} from "../person/api/api";
import {skattekortYears} from "../../util/dateUtils";
import {ForsystemEnum} from "./api/FlereFnrRequest";

interface OpprettAbonnementModalProps {
    fnr: string;
    abonnementer: string[];
    setAlertMessages: Dispatch<SetStateAction<{ message: string, variant: "success" | "error" | "warning" }[]>>;
}

export default function OpprettAbonnementModal({fnr, abonnementer, setAlertMessages}: Readonly<OpprettAbonnementModalProps>) {
    const ref = useRef<HTMLDialogElement>(null);

    const [selectedForsystemer, setSelectedForsystemer] = useState<string[]>([]);
    const [aar, setAar] = useState<number[]>([]);

    const handleClick = () => {
        ref.current?.showModal();
    };
    function handleClose() {
        ref.current?.close();
    }
    
    function handleOpprettAbonnement() {
        for (const hvertAar of aar) {
            for (const hvertForsystem of selectedForsystemer) {
                bestillSkattekort({personIdent: fnr, aar: hvertAar, forsystem: hvertForsystem})
                        .then(() => {
                            setAlertMessages(prev => [
                                ...prev, 
                                {message: `Abonnement for ${fnr} for ${hvertForsystem}${hvertAar} opprettet`, 
                                    variant: "success"}
                            ])
                        })
                        .catch((error) => {
                            setAlertMessages(prev => [...prev, {
                                message: `${hvertForsystem} for år ${hvertAar} : ${error.error?.meldingFraBackend}`,
                                variant: "error",
                            }])
                        })
            }
        }
        handleClose()
    }
    return (
        <Box>
            <Button size="xsmall" variant={"tertiary"} onClick={handleClick}>
                Abonner
            </Button>

            <Modal ref={ref} header={{heading: "Abonner"}}>
                <Modal.Body>
                    <VStack gap={"space-16"}>
                        <BodyLong>
                            Abonner på {fnr}
                        </BodyLong>
                        <HStack gap="space-16" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} onChange={setSelectedForsystemer}>
                                {ForsystemEnum.options.map((forsystem) =>
                                    <Checkbox key={"forsystemchoice"+fnr+forsystem} value={forsystem}>{forsystem}</Checkbox>)}
                            </CheckboxGroup>
                            <CheckboxGroup legend={"År"} onChange={setAar}>
                                {skattekortYears().map((year) => 
                                    <Checkbox key={"yearchoice"+fnr+year} value={year }>{year}</Checkbox>)
                                }
                            </CheckboxGroup>
                        </HStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={selectedForsystemer.length === 0} onClick={handleOpprettAbonnement}>Abonner</Button>
                    <Button variant={"secondary"} onClick={handleClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </Box>
    )
}