import type {BatchInsightRequest, BatchInsightResponse} from "./Bestillingsbatch";
import useSWR from "swr";
import {api, BASE_URI, swrConfig} from "../../../common/apiConfig";
import type {AxiosResponse} from "axios";

export function useFetchBatcher(batchInsightRequest: BatchInsightRequest | null): {
    data: BatchInsightResponse | undefined;
    error: Error;
    isLoading: boolean;
} {
    const {data, error, isLoading} = useSWR<BatchInsightResponse>(
        batchInsightRequest ? ["/bestillingsbatcher", batchInsightRequest] : null,
        {
            ...swrConfig<BatchInsightResponse, [string, BatchInsightRequest]>(
                async ([_url, request]: [string, BatchInsightRequest]) => {
                    return api(BASE_URI.SOKOS_SKATTEKORT_ADMIN_API)
                        .post<
                            { datoFom: string, datoTom: string },
                            AxiosResponse<BatchInsightResponse>
                        >(_url, request)
                        .then((response: AxiosResponse<BatchInsightResponse>) => response.data)
                        .then((batchInsightResponse: BatchInsightResponse) => batchInsightResponse)
                },
            ),
            onError: (error) => {
                return {data: {}, error, isValidating: false};
            },
            shouldRetryOnError: false,
        },
    );
    return {status: data, error, isLoading};
}