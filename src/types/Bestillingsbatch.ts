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

// BestillingsbatchId is a Kotlin @JvmInline value class over Long,
// serialized as a plain number in JSON.
export const BestillingsbatchSchema = z.object({
    id: z.number().int().nullable().optional(),
    status: BestillingsbatchStatusSchema,
    type: BestillingsbatchTypeSchema,
    bestillingsreferanse: z.string(),
    oppdatert: z.string(),
    opprettet: z.string(),
    dataSendt: z.string(),
    dataMottatt: z.string().nullable().optional(),
    showFullRequest: z.boolean().optional(),
});

export type Bestillingsbatch = z.infer<typeof BestillingsbatchSchema>;
export type BestillingsbatchStatus = z.infer<typeof BestillingsbatchStatusSchema>;
export type BestillingsbatchType = z.infer<typeof BestillingsbatchTypeSchema>;


export const BatchInsightResponseSchema = z.object({items:z.array(BestillingsbatchSchema)});
export type BatchInsightResponse = z.infer<typeof BatchInsightResponseSchema>;

export const BatchInsightRequestSchema = z.object({
    tidspunktFom: z.string(),
    tidspunktTom: z.string()})

export type BatchInsightRequest = z.infer<typeof BatchInsightRequestSchema>;
