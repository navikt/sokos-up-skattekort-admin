import {http, HttpResponse} from "msw";
import mangeSkattekort from "./responseMedMangeSkattekort.json";
import type {HentSkattekortRequest} from "../src/types/HentSkattekortRequestSchema";
import ingenSkattekort from "./responseUtenSkattekort.json";
import auditLogg from "./auditLogg.json"
import batcher from "./batcher_mindre.json"
import batcherUtenJson from "./batcherUtenJson.json"
import bestillinger from "./bestillinger.json"
import utsendinger from "./utsendinger.json"
import {now} from "../src/util/dateUtils";

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
        skattekortBestilt = now();
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
    http.post("/sokos-skattekort/api/v1/admin/bestillingsbatcher", async ({request}) => {
        return HttpResponse.json(batcher, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/bestillingsbatcher", async () => {
        return HttpResponse.json(batcherUtenJson, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/bestillinger", async () => {
        return HttpResponse.json(bestillinger, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/utsendinger", async () => {
        return HttpResponse.json(utsendinger, {status: 200});
    }),
    http.patch("/sokos-skattekort/api/v1/admin/bestillingsbatcher/:id", async ({request}) => {
        return new HttpResponse(null, {status: 202})
    })
    
];
let skattekortBestilt: Date | null = null;
