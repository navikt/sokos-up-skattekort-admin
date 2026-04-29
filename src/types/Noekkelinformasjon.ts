import {z} from "zod"

const AarKey = z.string().regex(/^\d{4}$/, "Må være et 4-sifret år");
const PersonerKey = z.literal("personer");

export const NoekkelinformasjonResponseSchema = z.object({
    antallAvHver: z.record(
        z.union([AarKey, PersonerKey]),
        z.number().int().nonnegative(),
    ),
});

export type NoekkelinformasjonResponse = z.infer<typeof NoekkelinformasjonResponseSchema>;
