import path from "node:path";
import https from "node:https";
import express, { type Request, type Response } from "express";
import expressStaticGzip from "express-static-gzip";

const basePath = "";
const buildPath = path.resolve(import.meta.dirname, "../dist");
const server = express();
const apiTarget = new URL("http://sokos-skattekort");

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

server.use("/api", (req, res, next) => {
	const proxyRequest = https.request(
		{
			protocol: apiTarget.protocol,
			hostname: apiTarget.hostname,
			port: apiTarget.port || 443,
			method: req.method,
			path: req.originalUrl,
			headers: {
				...req.headers,
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
