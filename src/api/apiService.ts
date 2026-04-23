import useSWRImmutable from "swr/immutable";
import {api, axiosPostFetcher} from "./apiConfig";
import type {ForespoerselRequest} from "./models/ForespoerselRequest";
import {type HentNavnResponse, HentNavnResponseSchema} from "../types/HentNavnResponse";
import type {AxiosError, AxiosResponse} from "axios";
import type {HentNavnRequest} from "../types/HentNavnRequest";
import {
    type WrappedHentNavnResponseWithError,
    WrappedHentNavnResponseWithErrorSchema,
    type WrappedSkattekortResponseDTOWithError,
    WrappedSkattekortResponseDTOWithErrorSchema,
    type WrappedStatusResponseWithError,
    WrappedStatusResponseWithErrorSchema
} from "../types/WrappedResponseWithErrorSchema";
import {BackendError, NoDataError} from "../types/Error";
import {type Skattekort, SkattekortListSchema} from "../types/SkattekortResponseDTOSchema";
import type {HentSkattekortRequest} from "../types/HentSkattekortRequestSchema";
import type {ZodError} from "zod";
import useSWR from "swr";
import type {AuditResponse} from "../types/Audit";
import type {BatchInsightRequest, BatchInsightResponse} from "../types/Bestillingsbatch";

export type OtherErrors = AxiosError | ZodError<unknown> | BackendError;
export type AllErrors = OtherErrors | NoDataError;

const BASE_URI = {
    SOKOS_SKATTEKORT_API: "/sokos-skattekort/api/v1/",
    SOKOS_SKATTEKORT_PERSON_API: "/sokos-skattekort/api/v2/person/",
    SOKOS_SKATTEKORT_ADMIN_API: "/sokos-skattekort/api/v1/admin/"
};

function swrConfig<T, ArgType>(fetcher: (arg: ArgType) => Promise<T>) {
    return {
        fetcher,
        revalidateOnFocus: false,
        refreshInterval: 600000,
    };
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
    request: ForespoerselRequest,
    shouldRefresh: boolean
) {
    const key = request.personIdent?.length === 11 ? ["/skattekort/status", request] : null;
    // useSWR skal være mutable slik at vi kan polle status mens bestilling og henting pågår
    const {data, error, isLoading} = useSWR<WrappedStatusResponseWithError>(
         key,
        {
            ...swrConfig<WrappedStatusResponseWithError, [string, string]>(
                async ([_url, request]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_API)
                        .post<
                            ForespoerselRequest,
                            AxiosResponse<WrappedStatusResponseWithError>
                        >(_url, request)
                        .then((response: AxiosResponse<WrappedStatusResponseWithError>) => response.data)
                        .then((wrapped: WrappedStatusResponseWithError) => {
                            const error = 
                                WrappedStatusResponseWithErrorSchema.safeParse(wrapped);
                            if (error.success) {
                                throw new BackendError(error.data.errorMessage);
                            }
                            if (!wrapped.data || wrapped.data.length === 0) {
                                throw new NoDataError();
                            }
                            return wrapped;
                        });
                },
            ),
            onError: (error) => {
                return {data:{data:"API_ERROR"}, error, isLoading: false};
            },
            refreshInterval: shouldRefresh ? 1000 : 0,
        });
    return {data, error, isLoading};
}

export function useFetchSkattekort(fnr: string): {
    data: Skattekort[] | undefined;
    error:  BackendError | NoDataError | null;
    isLoading: boolean;
} {
    const shouldFetch = fnr?.trim().length > 0;
    const { data, error, isLoading } = useSWRImmutable<Skattekort[]>(
        shouldFetch ? ["/hent-skattekort", fnr] : null,
        {
            ...swrConfig<Skattekort[], [string, string]>(
                async ([_url, fnr]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_PERSON_API)
                        .post<
                            HentSkattekortRequest,
                            AxiosResponse<WrappedSkattekortResponseDTOWithError>
                        >(_url, { fnr, hentAlle: true })
                        .then((response) => response.data)
                        .then((wrapped) => {
                            const error =
                                WrappedSkattekortResponseDTOWithErrorSchema.safeParse(wrapped);
                            if (error.success) {
                                throw new BackendError(error.data.errorMessage);
                            }
                            if (!wrapped.data || wrapped.data.length === 0) {
                                throw new NoDataError();
                            }
                            return SkattekortListSchema.parse(wrapped.data);
                        });
                },
            ),
            onError: (error) => {
                return { data: [], error, isValidating: false };
            },
            shouldRetryOnError: false,
        },
    );
    return { data, error, isLoading };
}

export function useFetchAuditLogg(fnr: string): {
    data: AuditResponse | undefined;
    error:  BackendError | NoDataError | null;
    isLoading: boolean;
} {
    const shouldFetch = fnr?.trim().length > 0;
    const { data, error, isLoading } = useSWRImmutable<AuditResponse>(
        shouldFetch ? ["/auditLogg", fnr] : null,
        {
            ...swrConfig<AuditResponse, [string, string]>(
                async ([_url, fnr]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .post<
                            {fnr: string},
                            AxiosResponse<AuditResponse>
                        >(_url, { fnr, hentAlle: true })
                        .then((response: AxiosResponse<AuditResponse>) => response.data)
                        .then((wrapped: AuditResponse) => wrapped)
                },
            ),
            onError: (error) => {
                return { data: {}, error, isValidating: false };
            },
            shouldRetryOnError: false,
        },
    );
    return { data, error, isLoading };
}

export function useFetchBatcher(batchInsightRequest: BatchInsightRequest|null): {
    data: BatchInsightResponse | undefined;
    error:  BackendError | NoDataError | null;
    isLoading: boolean;
} {
    const { data, error, isLoading } = useSWR<BatchInsightResponse>(
        batchInsightRequest ? ["/hentBatcher", batchInsightRequest] : null,
        {
            ...swrConfig<BatchInsightResponse, [string, BatchInsightRequest]>(
                async ([_url, request]: [string, BatchInsightRequest]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .post<
                            {datoFom: string, datoTom: string},
                            AxiosResponse<BatchInsightResponse>
                        >(_url, request)
                        .then((response: AxiosResponse<BatchInsightResponse>) => response.data)
                        .then((wrapped: BatchInsightResponse) => wrapped)
                },
            ),
            onError: (error) => {
                return { data: {}, error, isValidating: false };
            },
            shouldRetryOnError: false,
        },
    );
    return { data, error, isLoading };
}

