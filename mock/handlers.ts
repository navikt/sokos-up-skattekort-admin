import {http, HttpResponse} from "msw";
import mangeSkattekort from "./responseMedMangeSkattekort.json";
import type {HentSkattekortRequest} from "../src/tabs/person/api/HentSkattekortRequestSchema";
import ingenSkattekort from "./responseUtenSkattekort.json";
import auditLogg from "./auditLogg.json"
import batcher from "./batcher_mindre.json"
import batcherUtenJson from "./batcherUtenJson.json"
import bestillinger from "./bestillinger.json"
import utsendinger from "./utsendinger.json"
import noekkelinformasjon from "./noekkelinformasjon.json"
import detailedStatuses from "./detailStatuses.json";
import {addSeconds, now, skattekortYears} from "../src/util/dateUtils";
import {ForespoerselRequest} from "../src/tabs/person/api/ForespoerselRequest";

let refNr = 9000
let skattekortnstuff: number = refNr*(Math.round(Math.random()*100))
const reranIds: Array<number> = []

export const handlers = [
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
    http.post("/sokos-skattekort/api/v1/skattekort/bestille", async ({request}) => {
        skattekortBestilt = now();
        const sokeParameter = (await request.json()) as ForespoerselRequest;
        if (!skattekortYears().includes(sokeParameter.aar)) 
            return HttpResponse.json({message: "Feilmelding fra backend om inntektsår"}, {status: 400});
        return new HttpResponse(null, {status: 202})
    }),
    http.post("/sokos-skattekort/api/v1/skattekort/status", async () => {
        // eslint-disable-next-line no-negated-condition
        const status = /* ..................... */ !skattekortBestilt ? "IKKE_FORESPURT"
            : now() < addSeconds(skattekortBestilt, 5)               ? "VENTER_PAA_UTSENDING"
            : /* Og hvis det er mer enn 15s siden man trykket:       */ "ABONNERER";
        return HttpResponse.json({status}, {status: 200});
    }),
    http.post("/sokos-skattekort/api/v1/admin/auditlogg", async ({request}) => {
        const sokeParameter = (await request.json()) as {fnr:string};
        const res =
            sokeParameter.fnr === "11111111111" 
                ? {data:{items:[]}}
                : auditLogg;
        return HttpResponse.json(res, {status: 200});
    }),
    http.post("/sokos-skattekort/api/v1/admin/bestillingsbatcher", async () => {
        return HttpResponse.json(batcher, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/bestillingsbatcher", async () => {
        const nowStamp = now();
        const terningkast = Math.round(Math.random() * 2) 
        const saltaBatcher = terningkast === 0 ? batcherUtenJson.items : [{
            id: 8128,
            status: "NY",
            type: "OPPDATERING",
            bestillingsreferanse: `BR${refNr++}`,
            oppdatert: nowStamp.toISOString(),
            opprettet: nowStamp.toISOString()
        }, ...batcherUtenJson.items]
        return HttpResponse.json(
            {
                items: saltaBatcher.filter(batch => !reranIds.includes(batch.id)),
            },
            {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/bestillinger", async () => {
        return HttpResponse.json(bestillinger, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/utsendinger", async () => {
        return HttpResponse.json(utsendinger, {status: 200});
    }),
    http.get("/sokos-skattekort/api/v1/admin/noekkelinformasjon", async () => {
        skattekortnstuff += (Math.round(Math.random()*10))
        return HttpResponse.json(
            {"antallAvHver": {...noekkelinformasjon.antallAvHver,
                "2026": noekkelinformasjon.antallAvHver["2026"]+skattekortnstuff,
                "personer": noekkelinformasjon.antallAvHver["personer"]+Math.round(skattekortnstuff/2)
            }}, {status: 200});
    }),
    http.patch("/sokos-skattekort/api/v1/admin/bestillingsbatcher/:id", async ({params}) => {
        const id = Number(params.id)
        reranIds.push(id)
        return new HttpResponse(null, {status: 202})
    }),
    http.post("/sokos-skattekort/api/v1/skattekort/bestillingbulk/:forsystem/:year", async ({params}) => {
        const aar = params.year;
        if (!skattekortYears().includes(Number(aar))) return HttpResponse.json({message: "Feilmelding fra backend om inntektsår"}, {status: 400});
        return new HttpResponse(null, {status: 202})
    }),
    http.post("/sokos-skattekort/api/v1/skattekort/statuser", async () => {
        return HttpResponse.json(detailedStatuses, {status: 200})
    })
];
let skattekortBestilt: Date | null = null;
