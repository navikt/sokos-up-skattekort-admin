import {ErrorSummary, Heading} from "@navikt/ds-react";
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

export default function Errorhandler({heading, error}: Readonly<ErrorHandlerProps>) {
    
    return (
        <>
            {error && (
                <ErrorSummary heading={heading}>
                        <ErrorSummary.Item key={error?.name}>
                            <Heading size={"small"}>{error?.name}</Heading>
                            <pre>{JSON.stringify(safeParseJson(error), null, 2)}</pre>
                        </ErrorSummary.Item>
                    )
                </ErrorSummary>
            )}
        </>
    )
}
