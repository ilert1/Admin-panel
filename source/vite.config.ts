import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    plugins: [react()],
    server: {
        host: true
    },
    base: "./",
    optimizeDeps: {
        include: ["chart.js"]
    }
});

/* 

            .scrollbar-x::-webkit-scrollbar {
                height: 12px;
            }

            .scrollbar-x::-webkit-scrollbar-track {
                background-color: rgba(179, 179, 179, 1);
                border-radius: 8px;
            }

            .scrollbar-x::-webkit-scrollbar-thumb {
                background-color: rgba(35, 118, 72, 1);
                border-radius: 8px 0px 0px 0px;
                border: 2px solid rgba(35, 118, 72, 1);
            }

            .scrollbar-x::-webkit-scrollbar-thumb:hover {
                background-color: rgba(35, 118, 72, 0.8);
            } */
