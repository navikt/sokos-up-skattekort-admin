import type {FileObject} from "@navikt/ds-react";
import {BackendError} from "../../common/Error";
import {api, BASE_URI} from "../../common/apiConfig";

export async function postForesoerselfil(file: FileObject | null, forsystem: "OS" | "DARE_POC", inntektsaar: number): Promise<{
    data: string,
    error: BackendError | null
}> {
    if (!file) return {data: "", error: new BackendError("Ingen fil valgt")};
    try {
        const bytes = await file.file.arrayBuffer();
        const response = await api(BASE_URI.SOKOS_SKATTEKORT_API)
            .post(
                `/skattekort/bestillingbulk/${encodeURIComponent(forsystem)}/${encodeURIComponent(String(inntektsaar))}`,
                bytes, {
                    headers: {"Content-Type": "application/octet-stream"},
                })
        return {data: typeof response.data === "string" ? response.data : "Success", error: null}
    } catch (error) {
        if (error instanceof Error) {
            return {data: "", error: new BackendError(error.message)};
        }
        return {data: "", error: new BackendError("Ukjent feil ved opplasting")};
    }
}