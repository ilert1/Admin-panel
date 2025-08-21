import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeProvider";

const TestComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme("dark")}>Dark</button>
            <button onClick={() => setTheme("light")}>Light</button>
            <button onClick={() => setTheme("system")}>System</button>
        </div>
    );
};

describe("ThemeProvider", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = "";
    });

    it("использует defaultTheme, если localStorage пуст", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId("theme")).toHaveTextContent("light");
        expect(document.documentElement.classList.contains("light")).toBe(true);
    });

    it("читает тему из localStorage", () => {
        localStorage.setItem("vite-ui-theme", "dark");

        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("setTheme обновляет localStorage и класс на html", () => {
        render(
            <ThemeProvider defaultTheme="light">
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            screen.getByText("Dark").click();
        });

        expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("system-тема корректно применяет системный prefers-color-scheme", () => {
        const matchMediaMock = jest.fn().mockImplementation((query: string) => {
            return {
                matches: query === "(prefers-color-scheme: dark)",
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn()
            };
        });
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: matchMediaMock
        });

        render(
            <ThemeProvider defaultTheme="system">
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId("theme")).toHaveTextContent("system");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
});
