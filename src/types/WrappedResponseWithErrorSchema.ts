import { z } from "zod";
import { SkattekortResponseDTOSchema } from "./SkattekortResponseDTOSchema";
import {AuditSchema} from "./Audit";

export const WrappedHentNavnResponseWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
	data: z.optional(z.string()),
});

export type WrappedHentNavnResponseWithError = z.infer<
	typeof WrappedHentNavnResponseWithErrorSchema
>;

export const WrappedStatusResponseWithErrorSchema = z.object({
    errorMessage: z.string().refine((s) => s.length > 0),
    data: z.optional(z.string()),
});

export type WrappedStatusResponseWithError = z.infer<
    typeof WrappedStatusResponseWithErrorSchema
>;

export const WrappedAuditLoggWithErrorSchema = z.object({
    errorMessage: z.string().refine((s) => s.length > 0),
    data: z.object({items: z.optional(z.array(AuditSchema))}),
})

export type WrappedAuditLoggWithError = z.infer<typeof WrappedAuditLoggWithErrorSchema>;

export const WrappedSkattekortResponseDTOWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
	data: z.optional(z.array(SkattekortResponseDTOSchema)),
});

export type WrappedSkattekortResponseDTOWithError = z.infer<
	typeof WrappedSkattekortResponseDTOWithErrorSchema
>;
