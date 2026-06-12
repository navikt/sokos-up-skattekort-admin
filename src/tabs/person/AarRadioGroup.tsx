import {Radio, RadioGroup} from "@navikt/ds-react";
import {skattekortYears, thisYear} from "../../util/dateUtils";
import {useFormContext} from "react-hook-form";

export default function AarRadioGroup() {
    const { setValue, formState: {errors} } = useFormContext();

    return (
        <RadioGroup legend={"År"}
                    defaultValue={thisYear()}
                    error={errors.aar?.message as string}
                    onChange={(year) => setValue("aar",year)}
        >
            {skattekortYears().map((year) =>
                <Radio key={"soekyear" + year} value={year}>{year}</Radio>)}
        </RadioGroup>)
}