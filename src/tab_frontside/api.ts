import useSWR, {type KeyedMutator} from "swr";
import {api, axiosPatchFetcher, BASE_URI, swrConfig} from "../common/apiConfig";
import type {AxiosResponse} from "axios";
import {type BestillingerResponse, BestillingerResponseSchema} from "./Bestilling";
import {type NoekkelinformasjonResponse, NoekkelinformasjonResponseSchema} from "./Noekkelinformasjon";
import {type UtsendingerResponse, UtsendingerResponseSchema} from "./Utsending";
import {type IncompleteBatchesResponse, IncompleteBatchesResponseSchema} from "./BestillingsbatchWithoutJson";

export function useFetchLiveBestillinger(shouldRefresh: boolean): {
    data: BestillingerResponse | undefined;
    error: Error;
    isLoading: boolean;
} {
    const {data, error, isLoading} = useSWR<BestillingerResponse>(
        "/bestillinger",
        {
            ...swrConfig<BestillingerResponse, string>(
                async (_url: string) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .get<BestillingerResponse>(_url)
                        .then((response: AxiosResponse<BestillingerResponse>) => response.data)
                        .then((bestillinger: BestillingerResponse) => {
                            BestillingerResponseSchema.parse(bestillinger);
                            return bestillinger
                        })
                },
            ),
            refreshInterval: shouldRefresh ? 5000 : 0,
            shouldRetryOnError: false,
        }
    )
    return {data, error, isLoading};
}

export function useFetchLiveUtsendinger(shouldRefresh: boolean = false): {
    data: UtsendingerResponse | undefined;
    error: Error;
    isLoading: boolean;
} {
    const {data, error, isLoading} = useSWR<UtsendingerResponse>(
        "/utsendinger",
        {
            ...swrConfig<UtsendingerResponse, string>(
                async (_url: string) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .get<UtsendingerResponse>(_url)
                        .then((response: AxiosResponse<UtsendingerResponse>) => response.data)
                        .then((utsendinger: UtsendingerResponse) => {
                            UtsendingerResponseSchema.parse(utsendinger);
                            return utsendinger
                        })
                },
            ), refreshInterval: shouldRefresh ? 5000 : 0,
            shouldRetryOnError: false,
        }
    )
    return {data, error, isLoading};
}

export function useFetchNoekkelinformasjon(shouldRefresh: boolean = false): {
    data: NoekkelinformasjonResponse | undefined;
    error: Error;
    isLoading: boolean;
} {
    const {data, error, isLoading} = useSWR<NoekkelinformasjonResponse>(
        "/noekkelinformasjon",
        {
            ...swrConfig<NoekkelinformasjonResponse, string>(
                async (_url: string) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .get<NoekkelinformasjonResponse>(_url)
                        .then((response: AxiosResponse<NoekkelinformasjonResponse>) => response.data)
                        .then(wrapped => {
                            NoekkelinformasjonResponseSchema.parse(wrapped);
                            return wrapped;
                        })
                },
            ), refreshInterval: shouldRefresh ? 5000 : 0,
            shouldRetryOnError: false,
        }
    )
    return {data, error, isLoading};
}


export function useFetchAlleUferdigeBestillingsbatcher(shouldRefresh: boolean): {
    data: IncompleteBatchesResponse | undefined;
    error: Error;
    isLoading: boolean;
    mutate: KeyedMutator<IncompleteBatchesResponse>;
} {
    const {data, error, isLoading, mutate} = useSWR<IncompleteBatchesResponse>(
        "/bestillingsbatcher",
        {
            ...swrConfig<IncompleteBatchesResponse, string>(
                async (_url: string) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .get<IncompleteBatchesResponse>(_url)
                        .then((response: AxiosResponse<IncompleteBatchesResponse>) => response.data)
                        .then((batchInsightResponse: IncompleteBatchesResponse) => {
                            IncompleteBatchesResponseSchema.parse(batchInsightResponse);
                            return batchInsightResponse
                        })
                },
            ),
            refreshInterval: shouldRefresh ? 5000 : 0,
            shouldRetryOnError: false,
        }
    )
    return {data, error, isLoading, mutate};
}

export async function rerunBestillingsbatch(id: number) {
    return await axiosPatchFetcher(
        BASE_URI.SOKOS_SKATTEKORT_ADMIN_API,
        `/bestillingsbatcher/${id}`,
    ).then(() => {
        return "Success";
    })
}