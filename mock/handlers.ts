import {http, HttpResponse} from "msw";
import mangeSkattekort from "./responseMedMangeSkattekort.json";
import type {HentSkattekortRequest} from "../src/types/HentSkattekortRequestSchema";
import ingenSkattekort from "./responseUtenSkattekort.json";
import auditLogg from "./auditLogg.json"
import batcher from "./batcher.json"
import type {BatchInsightRequest} from "../src/types/Bestillingsbatch";

export const handlers = [
    http.post("/sokos-skattekort/api/v2/person/hent-navn", () => {
        return HttpResponse.json(
            {
                errorMessage: null,
                data: "Hent Navn"
            },
            {status: 200},
        );
    }),
    http.post(
        "/sokos-skattekort/api/v2/person/hent-skattekort",
        async ({request}) => {
            const sokeParameter = (await request.json()) as HentSkattekortRequest;
            const skattekort =
                sokeParameter.fnr === "11111111111" ||
                sokeParameter.fnr === "22222222222"
                    ? ingenSkattekort
                    : mangeSkattekort;
            return HttpResponse.json(skattekort, {status: 200});
        },
    ),
    http.post("/sokos-skattekort/api/v1/skattekort/bestille", async () => {
        skattekortBestilt = new Date();
        return HttpResponse.json({data: "", errorMessage: ""}, {status: 201});
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
        return HttpResponse.json({data: status}, {status: 200});
    }),
    http.post("/sokos-skattekort/api/v1/admin/auditlogg", async () => {
        return HttpResponse.json(auditLogg, {status: 200});
    }),
    http.post("/sokos-skattekort/api/v1/admin/hentBatcher", async ({request}) => {

        const requestObj = await request.json() as BatchInsightRequest

        const filtered = batcher.items
            .filter(batch =>
                requestObj?.tidspunktFom == null ||
                new Date(batch.oppdatert).getTime() > new Date(requestObj.tidspunktFom).getTime() ||
                new Date(batch.opprettet).getTime() > new Date(requestObj.tidspunktFom).getTime())
            .filter(batch =>
                requestObj?.tidspunktTom == null ||
                new Date(batch.oppdatert).getTime() < new Date(requestObj.tidspunktTom).getTime() ||
                new Date(batch.opprettet).getTime() < new Date(requestObj.tidspunktTom).getTime()
            )
        
        const filteredBatches = {
            ...batcher,
            items: filtered
        }
        return HttpResponse.json(filteredBatches, {status: 200});
    })
];
let skattekortBestilt: Date | null = null;
