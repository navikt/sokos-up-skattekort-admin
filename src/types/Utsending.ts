import { z } from "zod";
import {FoedselsnummerSchema} from "./SokParameter";
import {BestillingsbatchSchema} from "./Bestillingsbatch";

export const UtsendingDTOSchema = z.object({
    id: z.number().int(),
    fnr: FoedselsnummerSchema,
    inntektsaar: z.number().int(),
    forsystem: z.string(),
    failCount: z.number().int(),
    failMessage: z.string().nullable(),
    opprettet: z.iso.datetime(),
});

export type UtsendingDTO = z.infer<typeof UtsendingDTOSchema>;

export const UtsendingResponseSchema = z.object({
    items: z.array(UtsendingDTOSchema),
});

export type UtsendingResponse = z.infer<typeof UtsendingResponseSchema>;

export const UtsendingerResponseSchema = z.object({items:z.array(UtsendingDTOSchema)});
export type UtsendingerResponse = z.infer<typeof UtsendingerResponseSchema>;