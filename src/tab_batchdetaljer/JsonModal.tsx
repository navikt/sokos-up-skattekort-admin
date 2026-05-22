import {Button, Dialog} from "@navikt/ds-react";
import {useState} from "react";
import {FilesIcon} from "@navikt/aksel-icons";

interface JsonModalProps {
    hva: string;
    shortText: string;
    text: string | null | undefined;
}

export default function JsonModal(props: Readonly<JsonModalProps>) {

    const jsonString = props.text ? JSON.stringify(JSON.parse(props.text), null, 2) : "null";
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(jsonString)
        setCopied(true);    
        setTimeout(() => setCopied(false), 500);
    }

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
                    {props.text && <pre>{jsonString}</pre>}
                </Dialog.Body>
                <Dialog.Footer>
                    <Button icon={<FilesIcon title="a11y-title" fontSize="1.5rem"/>} onClick={handleCopy}
                            disabled={copied}>{copied ? "Kopiert!" : "Kopier"}</Button>
                    <Dialog.CloseTrigger>
                        <Button autoFocus>Lukk</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
