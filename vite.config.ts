import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => ({
	base: "/",
	css: {
		modules: {
			generateScopedName: "[name]__[local]___[hash:base64:5]",
		},
	},
	server: {
		proxy: {
			...(mode === "realdev" && {
				"/api": {
					target: "https://sokos-skattekort.intern.dev.nav.no",
					changeOrigin: true,
					secure: true,
				},
			}),
			...(mode === "backend" && {
				"/api": {
					target: "http://localhost:8080",
					changeOrigin: true,
					secure: false,
				},
			}),
			...(mode === "mock" && {
				"/mockServiceWorker.js": {
					target: "http://localhost:5173",
					rewrite: () => "skattekort-admin/mockServiceWorker.js",
				},
			}),
		},
	},
	plugins: [react(), cssInjectedByJsPlugin()],
}));