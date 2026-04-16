import type {Bestillingsbatch, BestillingsbatchStatus, BestillingsbatchType} from "../src/types/Bestillingsbatch";
import {forFemMinutterSiden, nowDate} from "../src/util/dateUtils";

export function batcherForSisteDoegn(): Bestillingsbatch[] {
    const batcher: Bestillingsbatch[] = []
    for (let i = 0; i < 10; i++) {
        batcher.push(aBatch(i, "FERDIG", "OPPDATERING"));
    }
    const recentBatch: Bestillingsbatch = {
        id: 1000099,
        status: "NY",
        type: "OPPDATERING",
        bestillingsreferanse: "FAKE99",
        opprettet: forFemMinutterSiden().toISOString(),
        oppdatert: forFemMinutterSiden().toISOString(),
        dataSendt: "{\"inntektsaar\":\"2026\",\"bestillingstype\":\"HENT_KUN_ENDRING\",\"kontaktinformasjon\":{\"epostadresse\":\"nav.ur.og.os@nav.no\",\"mobiltelefonummer\":\"+4721070000\"},\"varslingstype\":\"INGEN_VARSEL\"}"
    }
    batcher.push(recentBatch);
    
    return batcher;
}

function aBatch (id: number, status: BestillingsbatchStatus, type: BestillingsbatchType) {
    const numberString = id.toString().padStart(2, "0")
    return {
        id: 1000000 + id,
        status: status,
        type: type,
        bestillingsreferanse: `FAKE${numberString}`,
        opprettet: new Date(`${(nowDate())}T${numberString}:00:00`).toISOString(),
        oppdatert: new Date(`${(nowDate())}T${numberString}:${numberString}:00`).toISOString(),
        dataSendt: "{\"inntektsaar\":\"2026\",\"bestillingstype\":\"HENT_KUN_ENDRING\",\"kontaktinformasjon\":{\"epostadresse\":\"nav.ur.og.os@nav.no\",\"mobiltelefonummer\":\"+4721070000\"},\"varslingstype\":\"INGEN_VARSEL\"}",
        dataMottatt: "{\"status\":\"INGEN_ENDRINGER\"}"
    }
}