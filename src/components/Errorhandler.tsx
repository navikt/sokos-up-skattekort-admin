import {Alert, ErrorSummary, Heading} from "@navikt/ds-react";
import type {BackendError, NoDataError} from "../types/Error";
import type {AllErrors} from "../api/apiService";

export type ErrorHandlerProps = {
    heading: string;
    error: BackendError | NoDataError | null
};

function safeParseJson(error: AllErrors): string {
    try {
        return JSON.parse(error.message);
    } catch (_) {
        return error.message;
    }
}

function isNoDataError(error: AllErrors): error is NoDataError {
    return error && "name" in error && error.name === "NoDataError";
}

export default function Errorhandler({heading, error}: Readonly<ErrorHandlerProps>) {
    
    const noData = error ? isNoDataError(error) : null;
    
    return (
        <>
            {error && noData && (
                <Alert variant={"info"} role="alert">
                    Fant ingen skattekortopplysninger
                </Alert>
            )}
            {error && !noData &&
                <ErrorSummary heading={heading}>
                        <ErrorSummary.Item key={error.name}>
                            <Heading size={"small"}>{error.name}</Heading>
                            <pre>{JSON.stringify(safeParseJson(error), null, 2)}</pre>
                        </ErrorSummary.Item>
                    )
                </ErrorSummary>
            }
        </>
    )
}
