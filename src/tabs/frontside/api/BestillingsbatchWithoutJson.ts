import {z} from "zod";

export const BestillingsbatchStatusSchema = z.enum([
    "NY",
    "FERDIG",
    "FEILET",
    "RETRY",
]);

export const BestillingsbatchTypeSchema = z.enum([
    "BESTILLING",
    "OPPDATERING",
]);

export const BestillingsbatchSchema = z.object({
    id: z.number().int().nullable().optional(),
    status: BestillingsbatchStatusSchema,
    type: BestillingsbatchTypeSchema,
    bestillingsreferanse: z.string(),
    oppdatert: z.iso.datetime(),
    opprettet: z.iso.datetime(),
});

export type Bestillingsbatch = z.infer<typeof BestillingsbatchSchema>;
export type BestillingsbatchStatus = z.infer<typeof BestillingsbatchStatusSchema>;
export type BestillingsbatchType = z.infer<typeof BestillingsbatchTypeSchema>;
export const IncompleteBatchesResponseSchema = z.object({items:z.array(BestillingsbatchSchema)});
export type IncompleteBatchesResponse = z.infer<typeof IncompleteBatchesResponseSchema>;
