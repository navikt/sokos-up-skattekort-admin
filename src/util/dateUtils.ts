export function toLocalDate(zulu: string) {
    return Intl.DateTimeFormat("no-NO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(zulu));
}

let NORSK_FORMAT = Intl.DateTimeFormat("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
});

export function toLocalTime(zulu: string) {
    return NORSK_FORMAT.format(new Date(zulu));
}

export function toZulu(t: string) {
    if (/\d{2}\.\d{2}\.\d{4}[\sT]\d{2}:\d{2}:\d{2}[,.]?\d*/.test(t)) {
        return new Date(
            `${t.substring(6, 10)}-${t.substring(3, 5)}-${t.substring(0, 2)}`
            + `T${t.substring(11).replace(",", ".")}`)
            .toISOString()
    }

    const parsed = new Date(t.replace(",", "."));
    if (parsed.getTime()) return parsed.toISOString();
    return null;
}

export function toLocalDateTime(zulu: string | null) {
    return zulu ? toLocalDate(zulu) + " " + toLocalTime(zulu) : null;
}

export function now(): Date {
    return new Date(Date.now())
}


export function plus23H59m59s(date: Date): Date {
    return new Date(date.getTime() + 1000 * 24 * 60 * 60 - 1)
}

export const isMoreThan24HoursBetween = (from: Date, to: Date) =>
    to.getTime() - from.getTime() > 24 * 60 * 60 * 1000;

export function addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000)
}

export function timeBetweenIsoStrings(dateA: string, dateB: string | null) {
    const fom = new Date(dateA.replace(",", "."));
    const tom = dateB ? new Date(dateB.replace(",", ".")) : now();
    return tom.getTime() - fom.getTime()
}

export const A_DAY = 1000 * 60 * 60 * 24;

export type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
}

export function thisYear(): number {
    return new Date().getFullYear();
}

export function skattekortYears() {
    const y = thisYear();
    const dato = new Date();
    const DECEMBER = 11;
    if (dato.getMonth() === DECEMBER && dato.getDate() > 15) {
        return [y - 1, y, y + 1]
    } else {
        return [y - 1, y]
    }
}
