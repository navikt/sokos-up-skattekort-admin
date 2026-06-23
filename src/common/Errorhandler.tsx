import {Alert, Box, ErrorSummary, Heading} from "@navikt/ds-react";
import type {ApiError, BackendError} from "./Error";

export type ErrorHandlerProps = {
    heading: string;
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

export default function Errorhandler({heading, error, emptyResponse}: Readonly<ErrorHandlerProps>) {
    
    const noData = emptyResponse;
    const apiError = error ? isApiError(error) : null;
    const backendError = error ? isBackendError(error) : null;
    
    return (
        <Box margin={"space-16"}>
            {noData && (
                <Alert variant={"info"} role="alert">
                    Fant ingen skattekortopplysninger
                </Alert>
            )}
            {error && apiError &&
                <ErrorSummary heading={heading}>
                    <ErrorSummary.Item key={error.name}>
                        {error.message}
                    </ErrorSummary.Item>
                </ErrorSummary>
            }
            {error && isBackendError(error) &&
                <ErrorSummary heading={heading}>
                    <ErrorSummary.Item key={error.name}>
                        {error.meldingFraBackend}
                    </ErrorSummary.Item>
                </ErrorSummary>
            }
            
            {error && !noData && !apiError && !backendError &&
                <ErrorSummary heading={heading}>
                        <ErrorSummary.Item key={error.name}>
                            <Heading size={"small"}>{error.name}</Heading>
                            <pre>{JSON.stringify(safeParseJson(error), null, 2)}</pre>
                        </ErrorSummary.Item>
                </ErrorSummary>
            }
        </Box>
    )
}
