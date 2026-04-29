import { z } from "zod";
import {FoedselsnummerSchema} from "./SokParameter";
import {BestillingsbatchSchema} from "./Bestillingsbatch";

export const BestillingDTOSchema = z.object({
    id: z.number().int(),
    personId: z.number().int(),
    fnr: FoedselsnummerSchema,
    inntektsaar: z.number().int(),
    bestillingsbatchId: z.number().int().nullable().optional(),
    oppdatert: z.iso.datetime(),
});

export type BestillingDTO = z.infer<typeof BestillingDTOSchema>;

export const BestillingResponseSchema = z.object({
    items: z.array(BestillingDTOSchema),
});

export type BestillingResponse = z.infer<typeof BestillingResponseSchema>;

export const BestillingerResponseSchema = z.object({items:z.array(BestillingDTOSchema)});
export type BestillingerResponse = z.infer<typeof BestillingerResponseSchema>;