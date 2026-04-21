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

function refineString(dateString:string){
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime())
}

const HjemmelagetDatoTid = z.string()
    .refine(refineString,
        { message: "Eksempel: 2025-01-01T00:00:00.123456Z" }
    )

export const BatchInsightRequestSchema = z.object({
    tidspunktFom: HjemmelagetDatoTid.nullable(),
    tidspunktTom: HjemmelagetDatoTid.nullable(),
})

export type BatchInsightRequest = z.infer<typeof BatchInsightRequestSchema>;
