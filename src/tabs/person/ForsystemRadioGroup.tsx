import {useFormContext} from "react-hook-form";
import {Radio, RadioGroup} from "@navikt/ds-react";
import {ForsystemEnum} from "../bestillMedFil/api/FlereFnrRequest";

export default function ForsystemRadioGroup() {
    const {register, formState: {errors}} = useFormContext();

    return (
        <RadioGroup legend={"Forsystem"} defaultValue={ForsystemEnum.enum.OS}
        error={JSON.stringify(errors.forsystem?.message, null, 2)}>
            {ForsystemEnum.options.map((forsystem) =>
                <Radio key={"soek" + forsystem}
                       {...register("forsystem")}
                       value={forsystem}>{forsystem}</Radio>)}
        </RadioGroup>
    )
}




