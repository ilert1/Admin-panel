import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
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
    plugins: [react(), svgr()],
    server: {
        host: true
    },
    define: {
        "process.env": {}
    },
    base: "/",
    build: {
        rollupOptions: {
            output: {
                // Хеши для entry-файлов (main.js, app.js и т. д.)
                entryFileNames: "assets/[name].[hash].js",
                // Хеши для чанков (динамически подгружаемых модулей)
                chunkFileNames: "assets/[name].[hash].js",
                // Хеши для ассетов (CSS, изображения, шрифты)
                assetFileNames: "assets/[name].[hash].[ext]"
            }
        }
    }
});
