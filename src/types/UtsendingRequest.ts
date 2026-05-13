import { z } from "zod";

export const TillattForsystemSchema = z.enum(["OS", "DARE_POC"]);
export type TillattForsystem = z.infer<typeof TillattForsystemSchema>;

const FnrSchema = z
    .string()
    .regex(/^\d{11}$/, "Fnr må være 11 sifre");

export const UtsendingRequestSchema = z.object({
    fnr: z
        .array(FnrSchema)
        .min(1, "Listen av fnr kan ikke være tom. Den må inneholde minst ett fnr."),
    aar: z.number().int(),
    forsystem: TillattForsystemSchema,
});

export type UtsendingRequest = z.infer<typeof UtsendingRequestSchema>;