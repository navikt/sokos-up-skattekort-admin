import {useFormContext} from "react-hook-form";
import {Radio, RadioGroup} from "@navikt/ds-react";
import {ForsystemEnum} from "../bestillMedFil/api/FlereFnrRequest";

export default function ForsystemRadioGroup() {
    const {setValue, formState: {errors}} = useFormContext();

    return (
        <RadioGroup legend={"Forsystem"} defaultValue={ForsystemEnum.enum.OS}
        error={errors.forsystem?.message as string}
        onChange={(forsystem) => setValue("forsystem",forsystem) }
        >
            {ForsystemEnum.options.map((forsystem) =>
                <Radio key={"soekforsystem" + forsystem} value={forsystem}>{forsystem}</Radio>)}
        </RadioGroup>
    )
}




