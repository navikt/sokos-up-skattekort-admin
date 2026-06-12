export enum Foedselsnummerkategori {
    UGYLDIG_FNR = "UGYLDIG_FNR",
    FNR = "FNR",
    DNR = "DNR",
    DOLLY = "DOLLY",
    TESTNORGE = "TESTNORGE",
}

export function foedselsnummerkategori(fnr: string) {
    
    const dayPart = parseInt(fnr.substring(0, 2))
    const monthPart = parseInt(fnr.substring(2, 4))
    const yearPart = parseInt(fnr.substring(4, 6))
    const individsifre = parseInt(fnr.substring(6, 9))
    
    const actualYear = actualyear(yearPart, individsifre)
    
    if (!actualYear) return Foedselsnummerkategori.UGYLDIG_FNR
    
    if (isValidDate(dayPart, monthPart, actualYear)) {
        return Foedselsnummerkategori.FNR
    }
    if (isValidDate(dayPart - 40, monthPart, actualYear)) {
        return Foedselsnummerkategori.DNR
    }
    if (isValidDate(dayPart, monthPart - 40, actualYear)
        || isValidDate(dayPart - 40, monthPart - 40, actualYear)) {
        return Foedselsnummerkategori.DOLLY
    }
    if (isValidDate(dayPart, monthPart - 80, actualYear) ||
        isValidDate(dayPart - 40, monthPart - 80, actualYear)
    ) {
        return Foedselsnummerkategori.TESTNORGE
    }
    return Foedselsnummerkategori.UGYLDIG_FNR
}

function actualyear(year: number, individsifre:number) {
    const DEFAULT = 2000 // 2000 er et skuddår i motsetning til 1900 og noen kan være født 29.02.2000, 
    // men ingen levende er født 29.februar 1900 
    if (0 <= individsifre && individsifre <= 499 ) return year+1900;
    if (500 <= individsifre && individsifre <= 749 && year >= 54) return year+1800;
    if (500 <= individsifre && individsifre <= 749 && year <= 53) return DEFAULT 
    if (500 <= individsifre && individsifre <= 999 && year <= 39) return year+2000;
    if (750 <= individsifre && individsifre <= 900 && year >= 40) return DEFAULT
    if (900 <= individsifre && individsifre <= 999 && year >= 40) return year+1900;
    return DEFAULT
}

function isValidDate(day:number, month:number, year:number) {
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

