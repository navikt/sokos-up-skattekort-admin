import {type Skattekort, SkattekortListSchema} from "./SkattekortResponseDTOSchema";
import useSWR from "swr";
import {api, axiosPostFetcher, BASE_URI, swrConfig} from "../../../common/apiConfig";
import type {HentSkattekortRequest} from "./HentSkattekortRequestSchema";
import type {AxiosResponse} from "axios";
import {
    type WrappedSkattekortResponseDTOWithError,
    WrappedSkattekortResponseDTOWithErrorSchema
} from "./WrappedResponseWithErrorSchema";
import {BackendError, NoDataError} from "../../../common/Error";
import type {ForespoerselRequest} from "./ForespoerselRequest";
import {type SkattekortStatusResponse, SkattekortStatusResponseSchema} from "./SkattekortStatusResponse";
import {type AuditLogg, AuditLoggSchema, type WrappedAuditLoggWithError, WrappedAuditLoggWithErrorSchema} from "./Audit";

export function useFetchSkattekort(fnr: string | null): {
    data: Skattekort[] | undefined;
    error: Error;
    isLoading: boolean;
} {
    const shouldFetch = fnr != null && fnr.trim().length > 0;
    const {data, error, isLoading} = useSWR<Skattekort[]>(
        shouldFetch ? ["/hent-skattekort", fnr] : null,
        {
            ...swrConfig<Skattekort[], [string, string]>(
                async ([_url, fnr]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_PERSON_API)
                        .post<
                            HentSkattekortRequest,
                            AxiosResponse<WrappedSkattekortResponseDTOWithError>
                        >(_url, {fnr, hentAlle: true})
                        .then((response) => response.data)
                        .then((wrapped) => {
                            const error =
                                WrappedSkattekortResponseDTOWithErrorSchema.safeParse(wrapped);
                            if (error.success) {
                                throw new BackendError(error.data.errorMessage);
                            }
                            const data = wrapped.data;

                            if (!data || data.length === 0) {
                                throw new NoDataError();
                            }
                            return SkattekortListSchema.parse(wrapped.data);
                        });
                },
            ),
            onError: (error) => {
                return {data: [], error, isValidating: false};
            },
            shouldRetryOnError: false,
        },
    );
    return {data, error, isLoading};
}

export async function bestillSkattekort(request: ForespoerselRequest) {
    return await axiosPostFetcher<ForespoerselRequest, { errorMessage?: string }>(
        BASE_URI.SOKOS_SKATTEKORT_API,
        "/skattekort/bestille",
        request,
    ).then((response) => {
        if (response.errorMessage) {
            return response.errorMessage;
        }
        return "Success";
    });
}

export function useFetchSkattekortStatus(
    request: ForespoerselRequest | null,
    shouldRefresh: boolean
) {
    const key = request?.personIdent?.length === 11 ? ["/skattekort/status", request] : null;
    const {data, error, isLoading} = useSWR<string>(
        key,
        {
            ...swrConfig<string, [string, string]>(
                async ([_url, request]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_API)
                        .post<
                            ForespoerselRequest,
                            AxiosResponse<SkattekortStatusResponse>
                        >(_url, request)
                        .then((response: AxiosResponse<SkattekortStatusResponse>) => response.data)
                        .then((data: SkattekortStatusResponse) => {
                            SkattekortStatusResponseSchema.parse(data);
                            return data.status;
                        });
                },
            ),
            onError: (error) => {
                return {data: "API_ERROR", error, isLoading: false};
            },
            refreshInterval: shouldRefresh ? 1000 : 0,
        });
    return {data, error, isLoading};
}

export function useFetchAuditLogg(fnr: string, shouldRefresh: boolean): {
    data: AuditLogg | undefined;
    error: Error;
    isLoading: boolean;
} {
    const shouldFetch = fnr?.trim().length > 0;
    const {data, error, isLoading} = useSWR<AuditLogg>(
        shouldFetch ? ["/auditLogg", fnr] : null,
        {
            ...swrConfig<AuditLogg, [string, string]>(
                async ([_url, fnr]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .post<
                            { fnr: string },
                            AxiosResponse<WrappedAuditLoggWithError>
                        >(_url, {fnr, hentAlle: true})
                        .then((response: AxiosResponse<WrappedAuditLoggWithError>) => response.data)
                        .then((wrappedResponse: WrappedAuditLoggWithError) => {
                            if (WrappedAuditLoggWithErrorSchema.safeParse(wrappedResponse).success) {
                                throw new BackendError(wrappedResponse.errorMessage);
                            }
                            return AuditLoggSchema.parse(wrappedResponse.data)
                        })
                },
            ),
            onError: (error) => {
                return {data: {}, error, isValidating: false};
            },
            shouldRetryOnError: false,
            refreshInterval: shouldRefresh ? 5000 : 0,
        },
    );
    return {data, error, isLoading};
}
