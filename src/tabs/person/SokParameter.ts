import {z} from "zod";
import {FoedselsnummerSchema} from "../../common/FoedselsnummerSchema";

export const SokParameterSchema = z.object({
	fnr: FoedselsnummerSchema
});

export type SokParameter = z.infer<typeof SokParameterSchema>;
