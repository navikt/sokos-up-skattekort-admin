import { z } from "zod";

export const ForsystemEnum = z.enum(["OS", "OS_STOR", "DARE_POC"]);
export type Forsystem = z.infer<typeof ForsystemEnum>;

const fnrTextToArray = z
    .string()
    .superRefine((value, ctx) => {
        const trimmed = value.trim();

        if (!trimmed) {
            ctx.addIssue("Legg inn minst ett fødselsnummer.",);
            return;
        }

        if (/[^0-9\s]/.test(value)) {
            ctx.addIssue("Kun siffer og mellomrom/linjeskift er tillatt.",);
            return;
        }

        const parts = trimmed.split(/\s+/);
        const invalid = parts.filter((p) => !/^\d{11}$/.test(p));
        if (invalid.length > 0) {
            ctx.addIssue(
                "Hvert fødselsnummer må ha nøyaktig 11 siffer.",
            );
        }
    })
    .transform((value) => value.trim().split(/\s+/));

export const FlereFnrRequestSchema = z.object({
    fnr: fnrTextToArray, // input: string, output: string[]
    aar: z.number().int(),
    forsystem: ForsystemEnum,
});

export type FlereFnrRequest = z.output<typeof FlereFnrRequestSchema>;
export type FlereFnrFormValues = z.input<typeof FlereFnrRequestSchema>;
