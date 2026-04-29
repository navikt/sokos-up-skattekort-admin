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
    oppdatert: z.iso.datetime(),
    opprettet: z.iso.datetime(),
    dataSendt: z.string().nullable().optional(),
    dataMottatt: z.string().nullable().optional(),
    showFullRequest: z.boolean().optional(),
});

export type Bestillingsbatch = z.infer<typeof BestillingsbatchSchema>;
export type BestillingsbatchStatus = z.infer<typeof BestillingsbatchStatusSchema>;
export type BestillingsbatchType = z.infer<typeof BestillingsbatchTypeSchema>;

const ACCEPT_EMPTY = true

export const BatchInsightResponseSchema = z.object({items:z.array(BestillingsbatchSchema)});
export type BatchInsightResponse = z.infer<typeof BatchInsightResponseSchema>;

const refineString = (shouldAcceptEmpty:boolean) => (dateString:string) => {
    if (!dateString) return shouldAcceptEmpty;

    const date = new Date(dateString);
    return !Number.isNaN(date.getTime())
}

export const BatchInsightRequestSchema = z.object({
    tidspunktFom: z.string()
        .refine(refineString(!ACCEPT_EMPTY),
            {message: "Må oppgis. Eksempel: 2025-01-01T00:00:00.123456Z"}
        ).nullable(),
    tidspunktTom: z.string()
        .refine(refineString(ACCEPT_EMPTY),
            {message: "Eksempel: 2025-01-01T00:00:00.123456Z"}
        ).nullable(),
})

export type BatchInsightRequest = z.infer<typeof BatchInsightRequestSchema>;
