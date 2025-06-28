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
                assetFileNames: "assets/[name].[hash].[ext]",
                manualChunks: {
                    // Основные библиотеки React
                    react: ["react", "react-dom", "react-router-dom"],

                    // React-админ и его зависимости
                    reactAdmin: [
                        "react-admin",
                        "ra-i18n-polyglot",
                        "ra-language-english",
                        "ra-language-russian",
                        "ra-keycloak"
                    ],

                    // Библиотеки для работы с формами
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],

                    // UI библиотеки Radix UI
                    radix: [
                        "@radix-ui/react-avatar",
                        "@radix-ui/react-checkbox",
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-label",
                        "@radix-ui/react-navigation-menu",
                        "@radix-ui/react-popover",
                        "@radix-ui/react-radio-group",
                        "@radix-ui/react-select",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slot",
                        "@radix-ui/react-tooltip",
                        "@radix-ui/themes"
                    ],

                    // Анимации
                    animation: ["framer-motion", "tailwindcss-animate"],

                    // Утилиты и вспомогательные библиотеки
                    utils: [
                        "lodash",
                        "clsx",
                        "tailwind-merge",
                        "tailwind-scrollbar-utilities",
                        "class-variance-authority"
                    ],

                    // Работа с датами
                    date: ["dayjs", "moment", "react-day-picker"],

                    // Таблицы и данные
                    data: ["@tanstack/react-table", "@tanstack/react-query", "papaparse"],

                    // UI компоненты
                    ui: [
                        "lucide-react",
                        "sonner",
                        "cmdk",
                        "react-number-format",
                        "@react-input/mask",
                        "react-loader-spinner"
                    ],

                    // Редактор кода
                    editor: ["@monaco-editor/react"],

                    // Прочее
                    other: ["big.js", "jwt-decode", "next-themes", "use-file-picker", "tronweb", "react-responsive"]
                }
            }
        }
    }
});
