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