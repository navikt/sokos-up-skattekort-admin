import axios, {type CreateAxiosDefaults} from "axios";
import {ApiError, HttpStatusCodeError} from "./Error";

const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

const config = (baseUri: string): CreateAxiosDefaults => ({
	baseURL: baseUri,
	timeout: 30000,
	withCredentials: true,
	headers: {
		Pragma: "no-cache",
		"Cache-Control": "no-cache",
		"Content-Type": "application/json",
        "Authorization" : accessToken ? `Bearer ${accessToken}` : "", // Opprett en fil som heter .env.backend.local som inneholder VITE_ACCESS_TOKEN=ey...
	},
	validateStatus: (status) => status < 400,
});

export function api(baseUri: string) {
    const instance = axios.create(config(baseUri));

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 400) {
                return Promise.reject(new ApiError(error.response?.data?.message));
            }
            if (error.response?.status === 401) {
                return Promise.reject(new ApiError("Du må logge inn"));
            }
            if (error.response?.status === 403) {
                return Promise.reject(error);
            }
            if (error.response?.status === 404) {
                return Promise.reject(new ApiError("Fant ikke endepunkt"));
            }
            if (error.response?.status === 500) {
                throw new HttpStatusCodeError(error.response?.status, "Serverfeil.");
            }
            throw new ApiError("Issues with connection to backend");
        },
    );
    return instance;
}

export async function axiosFetcher<T>(baseUri: string, url: string) {
    const res = await api(baseUri).get<T>(url);
    return res.data;
}

export async function axiosPatchFetcher(baseUri: string, url: string) {
    const res = await api(baseUri).patch(url);
    return res.data;
}

export async function axiosPostFetcher<T, U>(
	baseUri: string,
	url: string,
	body?: T,
) {
	const res = await api(baseUri).post<U>(url, body);
	return res.data;
}

export const BASE_URI = {
    SOKOS_SKATTEKORT_API: "/sokos-skattekort/api/v1/",
    SOKOS_SKATTEKORT_PERSON_API: "/sokos-skattekort/api/v2/person/",
    SOKOS_SKATTEKORT_ADMIN_API: "/sokos-skattekort/api/v1/admin/"
};

export function swrConfig<T, ArgType>(fetcher: (arg: ArgType) => Promise<T>) {
    return {
        fetcher,
        revalidateOnFocus: false,
        refreshInterval: 600000,
    };
}