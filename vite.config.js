import { defineConfig } from "vite";

import ViteRestart from "vite-plugin-restart";

import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    base: command === 'serve' ? '' : `${process.env.CRAFT_CLOUD_ARTIFACT_BASE_URL || ''}/dist/`,
    build: {
        emptyOutDir: true,
        manifest: "manifest.json",
        outDir: "../cms/web/dist",
        rollupOptions: {
            input: {
                "app": "./src/js/app.ts",
            },
        },
        sourcemap: true,
    },
    envDir: command === "build" ? "../../cms/web/environment" : "./",
    plugins: [
        ViteRestart({
            reload: ["./src/templates/**/*"],
        }),
    ],
    publicDir: "./src/public",
    resolve: {
        alias: [
            { find: "~", replacement: path.resolve(__dirname, "./src") },
        ],
        preserveSymlinks: true,
    },
    server: {
        // Allow cross-origin requests -- https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6
        allowedHosts: true,
        cors: {
            origin: /(\.local|\.site|localhost)/,
        },
        fs: {
            strict: false,
        },
        headers: {
            "Access-Control-Allow-Private-Network": "true",
        },
        host: "0.0.0.0",
        origin: "http://localhost:3000",
        port: 3000,
        strictPort: true,
    },
}));