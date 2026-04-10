import { Alert, ErrorSummary } from "@navikt/ds-react";
import type { BackendError, NoDataError } from "../types/Error";
import {AllErrors, OtherErrors} from "../api/apiService";

const DEBUG = false;

export type ErrorHandlerProps = {
	error: BackendError | NoDataError | null;
};

function safeParseJson(error: OtherErrors): string {
	try {
		return JSON.parse(error.message);
	} catch (_) {
		return error.message;
	}
}
function isBackendError(error: BackendError | NoDataError): error is BackendError {
	return error && "meldingFraBackend" in error;
}

function isNoDataError(error: AllErrors): error is NoDataError {
	return error && "name" in error && error.name === "NoDataError";
}

function isOtherError(error: AllErrors): error is OtherErrors {
	return !isNoDataError(error);
}

function navnErrorText(error: AllErrors) {
	if (isBackendError(error)) return error.meldingFraBackend;
	else if (isNoDataError(error)) return "Søket ga ingen treff";
	else
		return "Det oppstod en feil i kommunikasjon med PDL. Kan ikke vise navn.";
}

function skattekortErrorText(error: AllErrors) {
	if (isBackendError(error)) return error.meldingFraBackend;
	else if (isNoDataError(error))
		return "Vi fant ingen opplysninger om skattekort på dette fødselsnummeret";
	else
		return "Det oppstod en feil i kommunikasjon med Skattekort-tjenesten. Legg inn sak i porten hvis problemet vedvarer.";
}
export default function Errorhandler({
	error
}: Readonly<ErrorHandlerProps>) {
	return (
		<>

			{error && (
				<Alert variant={isNoDataError(error) ? "info" : "error"} role="alert">
					{skattekortErrorText(error)}
				</Alert>
			)}
            
			{DEBUG && error && isOtherError(error) && (
				<ErrorSummary>
					<pre>hent-skattekort: {JSON.stringify(error, null, 2)}</pre>
					{error.message && "message" in error && (
						<pre>{JSON.stringify(safeParseJson(error), null, 2)}</pre>
					)}
				</ErrorSummary>
			)}
		</>
	);
}
