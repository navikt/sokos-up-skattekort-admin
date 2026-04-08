import useSWRImmutable from "swr/immutable";
import {api, axiosPostFetcher} from "./apiConfig";
import type {ForespoerselRequest} from "./models/ForespoerselRequest";
import {HentNavnResponse, HentNavnResponseSchema} from "../types/HentNavnResponse";
import {AxiosResponse} from "axios";
import {HentNavnRequest} from "../types/HentNavnRequest";
import {
    WrappedHentNavnResponseWithError,
    WrappedHentNavnResponseWithErrorSchema,
    WrappedSkattekortResponseDTOWithError,
    WrappedSkattekortResponseDTOWithErrorSchema, WrappedStatusResponseWithError, WrappedStatusResponseWithErrorSchema
} from "../types/WrappedResponseWithErrorSchema";
import {BackendError, NoDataError} from "../types/Error";
import {Skattekort, SkattekortListSchema} from "../types/SkattekortResponseDTOSchema";
import {HentSkattekortRequest} from "../types/HentSkattekortRequestSchema";

const BASE_URI = {
    SOKOS_SKATTEKORT_API: "/sokos-skattekort/api/v1/",
    SOKOS_SKATTEKORT_PERSON_API: "/sokos-skattekort/api/v2/person/"
};

function swrConfig<T, ArgType>(fetcher: (arg: ArgType) => Promise<T>) {
    return {
        fetcher,
        revalidateOnFocus: false,
        refreshInterval: 600000,
    };
}

export function useFetchNavn(fnr: string): {
    data: string | undefined;
    error: any | null;
    isLoading: boolean;
} {
    const shouldFetch = fnr?.trim().length > 0;
    const {data, error, isLoading} = useSWRImmutable<HentNavnResponse>(
        shouldFetch ? ["/hent-navn", fnr] : null,
        {
            ...swrConfig<HentNavnResponse, [string, string]>(
                async ([_url, fnr]: [string, string]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_PERSON_API)
                        .post<
                            HentNavnRequest,
                            AxiosResponse<WrappedHentNavnResponseWithError>
                        >(_url, {fnr})
                        .then((response) => response.data)
                        .then((wrapped: WrappedHentNavnResponseWithError) => {
                            const error =
                                WrappedHentNavnResponseWithErrorSchema.safeParse(wrapped);
                            if (error.success) {
                                throw new BackendError(error.data.errorMessage);
                            }
                            if (!wrapped.data || wrapped.data.length === 0) {
                                throw new NoDataError();
                            }
                            return HentNavnResponseSchema.parse(wrapped.data);
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
    request: ForespoerselRequest,
    shouldRefresh: boolean,
    shouldFetch: boolean
) {
    const {data, error, isLoading} = useSWRImmutable<WrappedStatusResponseWithError>(
        shouldFetch ? ["/skattekort/status", request] : null,
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
                return {data:{data:"API_ERROR"}, error, isValidating: false};
            },
            shouldRetryOnError: false,
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

