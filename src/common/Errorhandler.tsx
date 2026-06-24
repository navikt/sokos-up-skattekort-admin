import {Alert, Box, ErrorSummary, Heading} from "@navikt/ds-react";
import type {ApiError, BackendError} from "./Error";

export type ErrorHandlerProps = {
    fetchSubject: string;
    error: BackendError | ApiError | Error | null;
    emptyResponse: boolean;
};

function safeParseJson(error: BackendError | Error): string {
    try {
        return JSON.parse(error.message);
    } catch (_) {
        return error.message;
    }
}

function isApiError(error: Error): error is ApiError{
    return error && "name" in error && error.name === "ApiError";
}

function isBackendError(error: BackendError | ApiError | Error | null): error is BackendError{
    return !!error && "meldingFraBackend" in error && error.name === "BackendError";
}

export default function Errorhandler({fetchSubject, error, emptyResponse: noData}: Readonly<ErrorHandlerProps>) {
    
    const apiError = error ? isApiError(error) : null;
    const backendError = error ? isBackendError(error) : null;
    const errorHeading = `Feil ved henting av ${fetchSubject}:`;
    return (
        <Box margin={"space-16"}>
            {noData && (
                <Alert variant={"info"} role="alert">
                    Fant ingen {fetchSubject}
                </Alert>
            )}
            {error && apiError &&
                <ErrorSummary heading={errorHeading}>
                    <ErrorSummary.Item key={error.name}>
                        {error.message}
                    </ErrorSummary.Item>
                </ErrorSummary>
            }
            {error && isBackendError(error) &&
                <ErrorSummary heading={errorHeading}>
                    <ErrorSummary.Item key={error.name}>
                        {error.meldingFraBackend}
                    </ErrorSummary.Item>
                </ErrorSummary>
            }
            
            {error && !noData && !apiError && !backendError &&
                <ErrorSummary heading={errorHeading}>
                        <ErrorSummary.Item key={error.name}>
                            <Heading size={"small"}>{error.name}</Heading>
                            <pre>{JSON.stringify(safeParseJson(error), null, 2)}</pre>
                        </ErrorSummary.Item>
                </ErrorSummary>
            }
        </Box>
    )
}
