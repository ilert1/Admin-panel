// $ npx orval --config ./orval.config.js
import { defineConfig } from "orval";

export default defineConfig({
    openapi: {
        input: {
            target: "./openapi.json",
            filters: {
                mode: "exclude",
                schemas: ["HealthStatus"],
                tags: ["Health", "Metrics"]
            },
            converterOptions: true
        },
        output: {
            baseUrl: {
                getBaseUrlFromSpecification: false,
                baseUrl: "https://apigate.develop.blowfish.api4ftx.cloud"
            },
            mode: "tags-split",
            target: "src/api/enigma",
            client: "react-query",
            httpClient: "fetch",
            headers: true,
            prettier: true
        }
    }
});
