import {z} from "zod";
import {SkattekortResponseDTOSchema} from "./SkattekortResponseDTOSchema";

export const WrappedSkattekortResponseDTOWithErrorSchema = z.object({
	errorMessage: z.string().refine((s) => s.length > 0),
    data:z.array(SkattekortResponseDTOSchema),
});

export type WrappedSkattekortResponseDTOWithError = z.infer<
	typeof WrappedSkattekortResponseDTOWithErrorSchema
>;
