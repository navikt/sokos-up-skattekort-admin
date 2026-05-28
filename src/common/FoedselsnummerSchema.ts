import {z} from "zod";

export const FoedselsnummerSchema = z
    .string()
    .refine(
        (val) => /^\d{11}$/.test(val),
        "Fødsels eller D-nummer må være 11 siffer",
    )