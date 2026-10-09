import https from "node:https";
import path from "node:path";
import { getToken, requestOboToken } from "@navikt/oasis";
import express, { type Request, type Response } from "express";
import expressStaticGzip from "express-static-gzip";
import { getServerSideEnvironment } from "./environment.js";

const basePath = "";
const buildPath = path.resolve(import.meta.dirname, "../dist");
const server = express();
const env = getServerSideEnvironment();
const apiTarget = 
	      (env==="development") ? new URL("https://sokos-skattekort.intern.dev.nav.no")
		: (env==="production") ? new URL("https://sokos-skattekort.intern.nav.no") 
				  : new URL("http://localhost:8080");
const oboAudience =
	      (env==="development") ? "api://dev-gcp.okonomi.sokos-skattekort/.default"
		: (env==="production") ? "api://prod-gcp.okonomi.sokos-skattekort/.default"
				  : "sokos-skattekort";

const corsAllowedOrigins: (string | RegExp)[] = [
	/^https:\/\/sokos-skattekort(?:-q[a-z0-9]+)?\.(?:ansatt|intern)(?:\.dev)?\.nav\.no$/,
	"http://localhost:5173",
];

function isAllowedOrigin(origin: string): boolean {
	return corsAllowedOrigins.some((o) =>
		typeof o === "string" ? o === origin : o.test(origin),
	);
}

server.use((req, res, next) => {
	const origin = req.headers.origin;
	if (origin && isAllowedOrigin(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
		if (req.method === "OPTIONS") {
			res.sendStatus(204);
			return;
		}
	}
	next();
});

server.use("/api", async (req, res, next) => {
	const incomingToken = getToken(req);
	if (!incomingToken) {
		res.status(401).json({ message: "Mangler innkommende brukertoken" });
		return;
	}

	const oboTokenResult = await requestOboToken(
		incomingToken,
		oboAudience,
	);

	if (!oboTokenResult.ok) {
		next(oboTokenResult.error);
		return;
	}

	const proxyRequest = https.request(
		{
			protocol: apiTarget.protocol,
			hostname: apiTarget.hostname,
			method: req.method,
			path: req.originalUrl,
			headers: {
				...req.headers,
				authorization: `Bearer ${oboTokenResult.token}`,
				host: apiTarget.host,
			},
		},
		(proxyResponse) => {
			res.status(proxyResponse.statusCode ?? 502);
			for (const [key, value] of Object.entries(proxyResponse.headers)) {
				if (value !== undefined) {
					res.setHeader(key, value);
				}
			}
			proxyResponse.pipe(res);
		},
	);

	proxyRequest.setTimeout(30_000, () => {
		proxyRequest.destroy(new Error("Upstream timeout"));
	});

	proxyRequest.on("error", (error) => {
		if (res.headersSent) {
			next(error);
			return;
		}
		if (error.message === "Upstream timeout") {
			res.status(504).json({ message: "Timeout mot backend" });
			return;
		}
		res.status(502).json({ message: "Feil ved kall mot backend" });
	});

	req.on("aborted", () => {
		proxyRequest.destroy();
	});

	req.pipe(proxyRequest);
});

server.get(`${basePath}/internal/isAlive`, (_req: Request, res: Response) => {
	res.sendStatus(200);
});

server.get(`${basePath}/internal/isReady`, (_req: Request, res: Response) => {
	res.sendStatus(200);
});

server.use(
	basePath,
	expressStaticGzip(buildPath, {
		enableBrotli: true,
		orderPreference: ["br"],
	}),
);

// biome-ignore lint/suspicious/noConsole: server startup
server.listen(8080, () => console.log("Server listening on port 8080"));
