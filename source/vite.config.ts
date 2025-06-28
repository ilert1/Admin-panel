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
                /* // Хеши для entry-файлов (main.js, app.js и т. д.)
                entryFileNames: "assets/[name].[hash].js",
                // Хеши для чанков (динамически подгружаемых модулей)
                chunkFileNames: "assets/[name].[hash].js",
                // Хеши для ассетов (CSS, изображения, шрифты)
                assetFileNames: "assets/[name].[hash].[ext]", */
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (
                            ["react", "react-dom", "react-router", "react-router-dom", "react-responsive"].includes(id)
                        ) {
                            return "react-vendor";
                        }

                        if (id.includes("@tanstack")) {
                            return "@tanstack";
                        }

                        if (id.includes("react-admin")) {
                            return "react-admin";
                        }

                        if (
                            [
                                "react-hook-form",
                                "zod",
                                "use-file-picker",
                                "@react-input/mask",
                                "@monaco-editor/react",
                                "@hookform/resolvers"
                            ].includes(id)
                        )
                            return "forms";

                        if (id.includes("tailwind")) return "tailwind";

                        if (id.includes("tronweb")) return "tronweb";

                        if (id.includes("ra-")) {
                            return "ra-modules";
                        }

                        if (id.includes("@radix-ui")) {
                            return "radix-ui";
                        }

                        if (
                            ["react-number-format", "lodash", "date-fns", "moment", "dayjs", "big.js", "clsx"].includes(
                                id
                            )
                        ) {
                            return "utils";
                        }

                        if (id.includes("lucide-react")) {
                            return "lucide-react";
                        }

                        return "vendor"; // остальные зависимости
                    }
                }
            }
        }
    }
});
