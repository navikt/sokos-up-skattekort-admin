import {z} from "zod";
import {SkattekortResponseDTOSchema} from "./SkattekortResponseDTOSchema";
import {AuditSchema} from "./Audit";

export const WrappedAuditLoggWithErrorSchema = z.object({
    errorMessage: z.string().refine((s) => s.length > 0),
    data: z.string().refine((s) => s.length === 0).or(z.object({items:z.array(AuditSchema)}))
})

export type WrappedAuditLoggWithError = z.infer<typeof WrappedAuditLoggWithErrorSchema>;

export const WrappedSkattekortResponseDTOWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
    data: z.string().refine((s) => s.length === 0).or(z.array(SkattekortResponseDTOSchema)),
});

export type WrappedSkattekortResponseDTOWithError = z.infer<
	typeof WrappedSkattekortResponseDTOWithErrorSchema
>;
