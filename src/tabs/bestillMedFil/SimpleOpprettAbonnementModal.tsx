import {BodyLong, Box, Button, Checkbox, CheckboxGroup, HStack, Modal, VStack} from "@navikt/ds-react";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {bestillSkattekort} from "../person/api/api";
import {ForsystemEnum} from "./api/FlereFnrRequest";

interface SimpleOpprettAbonnementModalProps {
    fnr: string;
    abonnementer: string[];
    inntektsaar: number;
    setAbonner: Dispatch<SetStateAction<Set<string>>>;
    setFailed: Dispatch<SetStateAction<Set<string>>>;
    setAlertMessages: Dispatch<SetStateAction<{ message: string, variant: "success" | "error" | "warning" }[]>>;
}

export default function SimpleOpprettAbonnementModal({
                                                         fnr,
                                                         abonnementer,
                                                         inntektsaar,
                                                         setAbonner,
                                                         setFailed,
                                                         setAlertMessages
                                                     }: Readonly<SimpleOpprettAbonnementModalProps>) {
    const ref = useRef<HTMLDialogElement>(null);
    const [selectedForsystemer, setSelectedForsystemer] = useState<string[]>([]);
    const handleClick = () => {
        ref.current?.showModal();
    };

    function handleClose() {
        ref.current?.close();
    }

    async function handleOpprettAbonnement() {
        const abonnerNow: string[] = [] as string[];
        const failedNow: string[] = [] as string[];
        for (const hvertForsystem of selectedForsystemer) {
            const abonnementString = `${hvertForsystem}${inntektsaar}`
            if (!abonnementer.includes(abonnementString)) {
                await bestillSkattekort({personIdent: fnr, aar: inntektsaar, forsystem: hvertForsystem})
                    .then(() => {
                        abonnerNow.push(abonnementString);
                        setAlertMessages(prev => [...prev, {
                            message: `Abonnement for ${fnr} for ${hvertForsystem}${inntektsaar} opprettet`,
                            variant: "success"
                        }
                        ])
                    })
                    .catch((error) => {
                        failedNow.push(abonnementString);
                        setAlertMessages(prev => [...prev, {
                            message: `${hvertForsystem} for år ${inntektsaar} : ${error.meldingFraBackend}`,
                            variant: "error",
                        }])
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
        ForsystemEnum.options
            .map(forsystem => <Checkbox
                readOnly={alreadyExistAbonnement.has(forsystem)} key={"simple"+forsystem}
                                        value={forsystem}>{forsystem}</Checkbox>)

    return (
        <Box>
            <Button size="xsmall" variant={"tertiary"} onClick={handleClick}>
                Abonner
            </Button>

            <Modal ref={ref} header={{heading: `Abonner`}}>
                <Modal.Body>
                    <VStack gap={"space-16"}>
                        <BodyLong>
                            Abonner for {fnr} for inntektsåret {inntektsaar}
                        </BodyLong>
                        <HStack gap="space-8" justify="space-evenly">
                            <CheckboxGroup legend={"Forsystem"} onChange={setSelectedForsystemer}>
                                {checkboxes}
                            </CheckboxGroup>
                        </HStack>
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={selectedForsystemer.length === 0} onClick={handleOpprettAbonnement}>Opprett
                        abonnement</Button>
                    <Button variant={"secondary"} onClick={handleClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </Box>
    )
}