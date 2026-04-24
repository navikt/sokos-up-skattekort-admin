import { z } from "zod";

export const FoedselsnummerSchema = z
    .string()
    .refine(
        (val) => /^\d{11}$/.test(val),
        "Fødsels eller D-nummer må være 11 siffer",
    )

export const SokParameterSchema = z.object({
	fnr: FoedselsnummerSchema
});

export type SokParameter = z.infer<typeof SokParameterSchema>;
