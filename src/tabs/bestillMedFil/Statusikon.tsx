import {ClipboardCheckmarkIcon, ExclamationmarkTriangleIcon, TasklistSendIcon} from "@navikt/aksel-icons";
import {Popover} from "@navikt/ds-react";
import {useState} from "react";

interface StatusikonProps{
    showIcon?: boolean;
    title: string;
    type: StatusikonType;
}

export enum StatusikonType {
    SUBSCRIBE = "SUBSCRIBE",
    SENDING = "SENDING",
    TROUBLE = "VELLYKKET"
}

const iconMap: Record<StatusikonType, React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
} & React.RefAttributes<SVGSVGElement>>> = {
    [StatusikonType.SUBSCRIBE]: ClipboardCheckmarkIcon,
    [StatusikonType.SENDING]: TasklistSendIcon,
    [StatusikonType.TROUBLE]: ExclamationmarkTriangleIcon,
}

export default function Statusikon({showIcon, title, type}: Readonly<StatusikonProps>) {
    const [ref, setRef] = useState<SVGSVGElement | null>(null);
    const [showPopover, setShowPopover] = useState<boolean>(false);
    const Icon = iconMap[type];
    
    if (!showIcon) return;
    
    return (<>
            <Icon ref={setRef} onClick={() => setShowPopover(!showPopover)} title={title} fontSize="1.5rem"/>
        {ref && 
            <Popover anchorEl={ref} open={showPopover} onClose={() => setShowPopover(false)}><Popover.Content>{title}</Popover.Content></Popover>}
        </>
)
}