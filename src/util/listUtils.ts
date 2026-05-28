import type {Bestillingsbatch} from "../tabs/batchdetaljer/api/Bestillingsbatch";

export function groupByDay(batcher: Bestillingsbatch[]) {
    const byDay: Record<string, Bestillingsbatch[]> = {};
    for (const curr of batcher) {
        const dato = new Date(curr.opprettet).toISOString().substring(0, 10);
        if (!byDay[dato]) {
            byDay[dato] = [];
        }
        byDay[dato].push(curr);
    }
    return byDay;
}

export class Periode<T> {
    item: T;
    fom:Date;
    tom:Date|undefined;
    constructor(item: T, fom:Date, tom: Date|undefined) {
        this.item = item;
        this.fom = fom;
        this.tom = tom;
    }
}

export function groupByDate<T>(perioder: Periode<T>[]) {
    const byDay: Record<string, Periode<T>[]> = {};
    for (const curr of perioder) {
        const dato = new Date(curr.fom).toISOString().substring(0, 10);
        if (!byDay[dato]) {
            byDay[dato] = [];
        }
        byDay[dato].push(curr);
    }
    return byDay;
}