import { HttpResponse, http } from "msw";
import mangeSkattekort from "./responseMedMangeSkattekort.json";
import {HentSkattekortRequest} from "../src/types/HentSkattekortRequestSchema";
import ingenSkattekort from "./responseUtenSkattekort.json";
import auditLogg from "./auditLogg.json"
import batcher from "./batcher.json"

export const handlers = [
    http.post("/sokos-skattekort/api/v2/person/hent-navn", () => {
        return HttpResponse.json(
            {errorMessage: null,
                data: "Hent Navn"},
            { status: 200 },
        );
    }),
    http.post(
        "/sokos-skattekort/api/v2/person/hent-skattekort",
        async ({ request }) => {
            const sokeParameter = (await request.json()) as HentSkattekortRequest;
            const skattekort =
                sokeParameter.fnr === "11111111111" ||
                sokeParameter.fnr === "22222222222"
                    ? ingenSkattekort
                    : mangeSkattekort;
            return HttpResponse.json(skattekort, { status: 200 });
        },
    ),
    http.post("/sokos-skattekort/api/v1/skattekort/bestille", async () => {
        skattekortBestilt = new Date();
        return HttpResponse.json({ data: "", errorMessage: "" }, { status: 201 });
    }),
    http.post("/sokos-skattekort/api/v1/skattekort/status", async () => {
        const status = !skattekortBestilt
            ? "IKKE_FORESPURT"
            : Date.now() < skattekortBestilt?.getTime() + 5 * 1000
                ? "IKKE_BESTILT"
                : Date.now() < skattekortBestilt?.getTime() + 10 * 1000
                    ? "BESTILT"
                    : Date.now() < skattekortBestilt?.getTime() + 15 * 1000
                        ? "VENTER_PAA_UTSENDING"
                        : /* Og hvis det er mer enn 15s siden man trykket:  */ "SENDT_FORSYSTEM";
        return HttpResponse.json({ data: status }, { status: 200 });
    }),
    http.post("/sokos-skattekort/api/v1/admin/auditlogg", async () => {
        return HttpResponse.json(auditLogg, { status: 200 });
    }),
    http.post("/sokos-skattekort/api/v1/admin/hentBatcher", async ({ request }) => {
        return HttpResponse.json(batcher, { status: 200 });
    })
];
let skattekortBestilt: Date | null = null;
