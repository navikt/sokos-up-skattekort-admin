import { z } from "zod";

const DetailStatusSchema = z.object({
    abonnements: z.array(z.string()),
    skattekortLastYear: z.boolean(),
    skattekortThisYear: z.boolean(),
    skattekortNextYear: z.boolean(),
});

export const DetailStatusResponseSchema = z.object({
    statuses: z.record(z.string(), DetailStatusSchema),
});

export type DetailStatusResponse = z.infer<typeof DetailStatusResponseSchema>;
export type DetailStatus = z.infer<typeof DetailStatusSchema>;
