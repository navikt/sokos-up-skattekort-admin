import { z } from "zod";

export const AuditTagSchema = z.enum([
    "BESTILLING_ETTERLATT",
    "BESTILLING_FEILET",
    "BESTILLING_SENDT",
    "HENTING_AV_SKATTEKORT_FEILET",
    "INVALID_FNR",
    "MOTTATT_FORESPOERSEL",
    "NYTT_FNR",
    "OPPDATERT_PERSONIDENTIFIKATOR",
    "OPPRETTET_PERSON",
    "SKATTEKORTINFORMASJON_MOTTATT",
    "SYNTETISERT_SKATTEKORT",
    "UKJENT",
    "UTSENDING_FEILET",
    "UTSENDING_OK",
    "UVENTET_PERSON",
    "MANUELL",
]);

export type AuditTag = z.infer<typeof AuditTagSchema>;

// AuditId and PersonId are @JvmInline value classes — serialized as their
// underlying Long (number) by kotlinx.serialization
export const AuditSchema = z.object({
    id: z.number().int().nullable().optional(),
    personId: z.number().int(),
    brukerId: z.string(),
    opprettet: z.string(),
    tag: AuditTagSchema,
    informasjon: z.string().nullable(),
});

export type Audit = z.infer<typeof AuditSchema>;