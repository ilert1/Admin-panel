/** @type {import('tailwindcss').Config} */

import { scrollbarGutter } from "tailwind-scrollbar-utilities";

export const darkMode = ["class"];
export const content = [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
];
export const prefix = "";
export const theme = {
    container: {
        center: true,
        padding: "2rem",
        screens: {
            "2xl": "1400px"
        }
    },
    extend: {
        colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            header: "hsl(var(--header))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            neutral: {
                0: "hsl(var(--neutral-0))",
                10: "hsl(var(--neutral-10))",
                20: "hsl(var(--neutral-20))",
                30: "hsl(var(--neutral-30))",
                40: "hsl(var(--neutral-40))",
                50: "hsl(var(--neutral-50))",
                60: "hsl(var(--neutral-60))",
                70: "hsl(var(--neutral-70))",
                80: "hsl(var(--neutral-80))",
                90: "hsl(var(--neutral-90))",
                100: "hsl(var(--neutral-100))"
            },
            green: {
                0: "hsl(var(--green-0))",
                10: "hsl(var(--green-10))",
                20: "hsl(var(--green-20))",
                30: "hsl(var(--green-30))",
                40: "hsl(var(--green-40))",
                50: "hsl(var(--green-50))",
                60: "hsl(var(--green-60))",
                70: "hsl(var(--green-70))"
            },
            yellow: {
                0: "hsl(var(--yellow-0))",
                10: "hsl(var(--yellow-10))",
                20: "hsl(var(--yellow-20))",
                30: "hsl(var(--yellow-30))",
                40: "hsl(var(--yellow-40))",
                50: "hsl(var(--yellow-50))",
                60: "hsl(var(--yellow-60))",
                70: "hsl(var(--yellow-70))"
            },
            red: {
                0: "hsl(var(--red-0))",
                10: "hsl(var(--red-10))",
                20: "hsl(var(--red-20))",
                30: "hsl(var(--red-30))",
                40: "hsl(var(--red-40))",
                50: "hsl(var(--red-50))",
                60: "hsl(var(--red-60))",
                70: "hsl(var(--red-70))"
            },
            orange: {
                0: "hsl(var(--orange-0))",
                10: "hsl(var(--orange-10))",
                20: "hsl(var(--orange-20))",
                30: "hsl(var(--orange-30))",
                40: "hsl(var(--orange-40))",
                50: "hsl(var(--orange-50))",
                60: "hsl(var(--orange-60))",
                70: "hsl(var(--orange-70))"
            },
            loginBG: "hsl(var(--loginBG))",
            secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))"
            },
            destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))"
            },
            muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))"
            },
            accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))"
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))"
            },
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))"
            },
            tooltip: {
                info: "hsl(var(--green-40))",
                info_bold: "hsl(var(--green-50))",
                warning: "hsl(var(--yellow-40))",
                error: "hsl(var(--red-40))"
            }
        },
        borderRadius: {
            4: "4px",
            8: "8px",
            10: "10px",
            12: "12px",
            16: "16px",
            20: "20px"
        },
        keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" }
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" }
            }
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out"
        },
        boxShadow: {
            1: "box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04)",
            2: "box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08)",
            3: "box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08)",
            4: "box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08)"
        },
        fontSize: {
            "display-1": ["32px", { lineHeight: "40px", fontWeight: 400 }],
            "display-2": ["28px", { lineHeight: "36px", fontWeight: 400 }],
            "display-3": ["24px", { lineHeight: "32px", fontWeight: 400 }],
            "display-4": ["20px", { lineHeight: "28px", fontWeight: 400 }],
            "title-bold": ["14px", { lineHeight: "20px", fontWeight: 700 }],
            "title-1": ["14px", { lineHeight: "20px", fontWeight: 400 }],
            "title-2": ["16px", { lineHeight: "22px", fontWeight: 400 }],
            body: ["12px", { lineHeight: "20px", fontWeight: 400 }],
            "body-bold": ["12px", { lineHeight: "16px", fontWeight: 700 }],
            text: ["12px", { lineHeight: "16px", fontWeight: 400 }],
            "note-1": ["12px", { lineHeight: "18px", fontWeight: 400 }],
            "note-2": ["10px", { lineHeight: "12px", fontWeight: 400 }]
        },
        gridTemplateColumns: {
            "1/9": "10% 90%"
        }
    }
};
export const plugins = [require("tailwindcss-animate"), scrollbarGutter()];
