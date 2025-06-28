import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
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
    plugins: [
        react(),
        svgr(),
        visualizer({
            open: true,
            filename: "bundle-analysis.html"
        })
    ],
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
                assetFileNames: "assets/[name].[hash].[ext]",
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (["@radix-ui", "react-day-picker", "lucide-react"].some(substr => id.includes(substr))) {
                            return "ui";
                        }

                        if (
                            ["react", "react-dom", "react-router", "react-router-dom", "react-responsive"].some(
                                substr => id.includes(substr)
                            )
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
                            ].some(substr => id.includes(substr))
                        )
                            return "forms";

                        if (id.includes("tailwind")) return "tailwind";

                        if (id.includes("tronweb")) return "tronweb";

                        if (id.includes("ra-")) {
                            return "ra-modules";
                        }

                        if (
                            [
                                "react-number-format",
                                "lodash",
                                "date-fns",
                                "moment",
                                "dayjs",
                                "big.js",
                                "clsx",
                                "bignumber",
                                "validator",
                                "axios"
                            ].some(substr => id.includes(substr))
                        ) {
                            return "utils";
                        }

                        if (id.includes("framer-motion")) {
                            return "framer-motion";
                        }

                        if (id.includes("ethers")) {
                            return "ethers";
                        }

                        return "vendor"; // остальные зависимости
                    }

                    if (id.includes("src")) {
                        if (id.includes("data")) {
                            return "data";
                        }
                        if (id.includes("lib")) {
                            return "lib";
                        }
                    }

                    if (id.includes("src/components/widgets/list")) {
                        return "lists";
                    }

                    /* if (id.includes("components")) {
                        const lowerId = id.toLowerCase();
                        if (lowerId.includes("transaction")) {
                            return "transaction";
                        }
                        if (lowerId.includes("account")) {
                            return "account";
                        }
                        if (lowerId.includes("merchant")) {
                            return "merchant";
                        }
                        if (lowerId.includes("terminal")) {
                            return "terminal";
                        }
                        if (lowerId.includes("withdraw")) {
                            return "withdraw";
                        }
                        if (lowerId.includes("callbridgehistory")) {
                            return "callbridgehistory";
                        }
                        if (lowerId.includes("mappings")) {
                            return "mappings";
                        }
                        if (lowerId.includes("wallet")) {
                            return "wallet";
                        }
                    } */
                }
            }
        }
    }
});
