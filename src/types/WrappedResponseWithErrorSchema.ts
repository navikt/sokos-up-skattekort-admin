import {z} from "zod";

export const WrappedHentNavnResponseWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
});

export type WrappedHentNavnResponseWithError = z.infer<
	typeof WrappedHentNavnResponseWithErrorSchema
>;

export const WrappedStatusResponseWithErrorSchema = z.object({
    errorMessage: z.string().refine((s) => s.length > 0),
});

export type WrappedStatusResponseWithError = z.infer<
    typeof WrappedStatusResponseWithErrorSchema
>;

export const WrappedAuditLoggWithErrorSchema = z.object({
    errorMessage: z.string().refine((s) => s.length > 0),
})

export type WrappedAuditLoggWithError = z.infer<typeof WrappedAuditLoggWithErrorSchema>;

export const WrappedSkattekortResponseDTOWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
});

export type WrappedSkattekortResponseDTOWithError = z.infer<
	typeof WrappedSkattekortResponseDTOWithErrorSchema
>;
