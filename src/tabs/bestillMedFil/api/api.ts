import type {FileObject} from "@navikt/ds-react";
import {BackendError} from "../../../common/Error";
import {api, BASE_URI, swrConfig} from "../../../common/apiConfig";
import {type DetailStatusResponse, DetailStatusResponseSchema} from "./DetailStatus";
import useSWR from "swr";
import type {AxiosResponse} from "axios";
import {Forsystem} from "./FlereFnrRequest";

export async function postForesoerselfil(file: FileObject | null, forsystem: Forsystem, inntektsaar: number): Promise<{
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
export async function postStatuses(file: FileObject | null): Promise<{
    data: DetailStatusResponse | null,
    error: BackendError | null
}> {
    if (!file) return {data: null, error: new BackendError("Ingen fil valgt")};
    try {
        const bytes = await file.file.arrayBuffer();
        return {data: await api(BASE_URI.SOKOS_SKATTEKORT_API)
                .post(
                    `/skattekort/statuser`,
                    bytes, {
                        headers: {"Content-Type": "application/octet-stream"},
                    })
                .then(res => DetailStatusResponseSchema.parse(res.data)), error: null}
    } catch (error) {
        if (error instanceof Error) {
            return {data: null, error: new BackendError(error.message)};
        }
        return {data: null, error: new BackendError("Ukjent feil ved opplasting")};
    }
}

export function useFetchStatuses(file: FileObject | null): {
    data: DetailStatusResponse | undefined;
    error: Error | null;
    isLoading: boolean;
} {
    const {data, error, isLoading} = useSWR<DetailStatusResponse>(
        file ? ["/skattekort/statuser", file] : null,
        {
            ...swrConfig<DetailStatusResponse, [string, FileObject]>(
                async ([_url, file]: [string, FileObject]) => {
                    const bytes = await file?.file.arrayBuffer();
                    return api(BASE_URI.SOKOS_SKATTEKORT_API)
                        .post<
                            ArrayBufferView,
                            AxiosResponse<DetailStatusResponse>
                        >(_url, bytes)
                        .then((response: AxiosResponse<DetailStatusResponse>) => response.data)
                        .then((detailStatusResponse: DetailStatusResponse) => detailStatusResponse)
                },
            ),
            onError: (error) => {
                return {data: {}, error, isValidating: false};
            },
            shouldRetryOnError: false,
        },
    );
    return {data, error, isLoading};
}

