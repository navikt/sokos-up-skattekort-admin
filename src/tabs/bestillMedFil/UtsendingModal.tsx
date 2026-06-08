import {BodyLong, Box, Button, Checkbox, CheckboxGroup, HStack, Modal, VStack} from "@navikt/ds-react";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {type Forsystem, ForsystemEnum} from "./api/FlereFnrRequest";
import {bestillSkattekort} from "../person/api/api";


interface UtsendingModalProps {
    fnr: string;
    inntektsaar: number;
    alreadySent: Set<Forsystem>;
    setSendes: Dispatch<SetStateAction<Set<Forsystem>>>;
}

export default function UtsendingModal({fnr, inntektsaar, alreadySent, setSendes}: Readonly<UtsendingModalProps>) {
    const ref = useRef<HTMLDialogElement>(null);
    const handleClick = () => {
        ref.current?.showModal();
    };
    const [forsystemer, setForsystemer] = useState<Set<Forsystem>>(new Set);

    async function handleSendUt() {
        const sendNow:Array<Forsystem> = [] as Forsystem[]
        for (const forsystem of forsystemer) {
            await bestillSkattekort({personIdent: fnr, aar: inntektsaar, forsystem})
                .then(response => sendNow.push(forsystem))
                .catch(error => {
                    //TODO
                    console.log(error)
                })
        }
        setSendes(prev => new Set([...prev, ...sendNow]));
        handleClose();
    }

    function handleClose() {
        ref.current?.close();
    }
    
    const checkboxes =
        ForsystemEnum.options
            .map(forsystem => <Checkbox readOnly={alreadySent.has(forsystem)} key={forsystem} value={forsystem}>{forsystem}</Checkbox>)


    return (
        <Box>
            <Button size="xsmall" variant={"tertiary"} onClick={handleClick}>Send ut</Button>

            <Modal ref={ref} header={{heading: `Send skattekort`}}>
                <Modal.Body>
                    <VStack gap={"space-16"}>
                        <BodyLong>
                            Send {fnr}s skattekort for {inntektsaar} til: 
                        </BodyLong>
                        <HStack gap="space-8" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} 
                                           value={[...forsystemer]}
                                           onChange={(values) => setForsystemer(new Set(values as Forsystem[]))}>
                                {checkboxes}
                            </CheckboxGroup>
                        </HStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSendUt}>Send</Button>
                    <Button variant={"secondary"} onClick={handleClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </Box>
    )
}