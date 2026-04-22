import {Button, Dialog} from "@navikt/ds-react";

interface JsonModalProps {
    hva: string;
    shortText: string;
    text: string | null | undefined;
}

export default function JsonModal(props: JsonModalProps) {
    return (
        <Dialog>
            <Dialog.Trigger>
                <Button variant={"tertiary"} disabled={props.shortText === "null"}> {props.shortText} </Button>
            </Dialog.Trigger>
            <Dialog.Popup modal={"trap-focus"}>
                <Dialog.Header>
                    <Dialog.Title>{props.hva}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    {props.text &&
                        <pre>{JSON.stringify(JSON.parse(props.text), null, 2)}</pre>
                    }
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button autoFocus>Lukk</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
