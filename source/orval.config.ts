import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    enigma: {
        input: {
            target: "./openapi/enigma.json",
            filters: {
                mode: "exclude",
                schemas: ["HealthStatus"],
                tags: ["Health", "Metrics"]
            }
        },
        output: {
            baseUrl: {
                getBaseUrlFromSpecification: false,
                baseUrl: process.env.VITE_APIGATE_BASE_URL || ""
            },
            mode: "tags-split",
            target: "./src/api/enigma",
            client: "fetch",
            headers: true,
            prettier: true,
            urlEncodeParameters: true,
            override: {
                mutator: {
                    path: "./src/helpers/orvalAuthFetchMiddleware.ts",
                    name: "authFetch"
                }
            }
        }
    },
    callbridge: {
        input: {
            target: "./openapi/callbridge.json",
            filters: {
                mode: "exclude",
                schemas: ["HealthStatus"],
                tags: ["Health", "Metrics"]
            }
        },
        output: {
            baseUrl: {
                getBaseUrlFromSpecification: false,
                baseUrl: process.env.VITE_APIGATE_BASE_URL || ""
            },
            mode: "tags-split",
            target: "./src/api/callbridge",
            client: "fetch",
            headers: true,
            prettier: true,
            urlEncodeParameters: true,
            override: {
                mutator: {
                    path: "./src/helpers/orvalAuthFetchMiddleware.ts",
                    name: "authFetch"
                }
            }
        }
    }
});
