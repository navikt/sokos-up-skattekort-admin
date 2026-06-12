import {z} from "zod";
import {FoedselsnummerSchema} from "../../common/FoedselsnummerSchema";
import {ForsystemEnum} from "../bestillMedFil/api/FlereFnrRequest";
import {skattekortYears} from "../../util/dateUtils";

export const SokParameterSchema = z.object({
	fnr: FoedselsnummerSchema,
    forsystem: ForsystemEnum,
    aar: z.number().refine((value) => {
        return !Number.isNaN(value) && skattekortYears().includes(value);
    })
});

export type SokParameter = z.infer<typeof SokParameterSchema>;
