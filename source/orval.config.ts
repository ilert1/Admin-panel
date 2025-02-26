import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения из .env

export default defineConfig({
    openapi: {
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
            prettier: true
        }
    }
});
