// $ npx orval --config ./orval.config.ts
import { defineConfig } from "orval";

export default defineConfig({
    openapi: {
        input: {
            target: "./openapi/enigma.json",
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
            target: "./src/api/enigma",
            client: "fetch",
            headers: true,
            prettier: true
        }
    }
});
