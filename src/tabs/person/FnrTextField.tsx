import {TextField} from "@navikt/ds-react";
import {useFormContext} from "react-hook-form";

function formaterFnr(fnr: string) {
    return fnr.replaceAll(/\D/g, "");
}
export default function FnrTextField() {
    const {
        register,
        formState: {
            errors,
        },
        setValue
    } = useFormContext();
    
    return (
    <TextField
        {...register("fnr")}
        size={"small"}
        autoComplete={"off"}
        htmlSize={30}
        maxLength={11}
        label="Gjelder"
        error={JSON.stringify(errors.fnr?.message,null,2)}
        onPaste={(event: React.ClipboardEvent<HTMLInputElement>) => {
            event.preventDefault();
            const fraUtklippstavle =
                event.clipboardData.getData("text/plain");
            const bareSiffer = formaterFnr(fraUtklippstavle);
            setValue("fnr", bareSiffer);
        }}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
    />
    )
}