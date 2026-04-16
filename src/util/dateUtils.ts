export function toLocalDate(zulu: string) {
    return Intl.DateTimeFormat("no-NO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(zulu));
}

export function toLocalTime(zulu: string) {
    return Intl.DateTimeFormat("no-NO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hourCycle: "h23",
    }).format(new Date(zulu));
}

export function toLocalDateTime(zulu: string) {
    return toLocalDate(zulu) + " " + toLocalTime(zulu);
}

export function forFemMinutterSiden():Date {
    return new Date(Date.now() - 1000 * 60 * 5)
}

export function forEtDoegnSiden():Date{
    return new Date(Date.now() - 1000 * 60 * 60 * 24)
}

export function now():Date {
    return new Date(Date.now())
}

export function atStartOfDay(date: Date):Date {
    return new Date ( date.getFullYear(), date.getMonth(), date.getDate())
}

export function atStartOfNextDay(date: Date):Date {
    return new Date ( date.getFullYear(), date.getMonth(), date.getDate() + 1)
}

export function nowDate() {
    return new Date().toISOString().slice(0, 10)
}

export const isMoreThan24HoursBetween = (from: Date, to: Date) =>
    to.getTime() - from.getTime() > 24 * 60 * 60 * 1000;