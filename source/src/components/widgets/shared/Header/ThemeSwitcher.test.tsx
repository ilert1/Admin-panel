import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "@/components/providers";
import { useTranslate } from "react-admin";

jest.mock("@/components/providers", () => ({
    useTheme: jest.fn()
}));

jest.mock("react-admin", () => ({
    useTranslate: jest.fn()
}));

describe("ThemeSwitcher", () => {
    const mockSetTheme = jest.fn();
    const mockTranslate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockTranslate.mockImplementation((key: string) => {
            const translations: Record<string, string> = {
                "app.theme.light": "Light Mode",
                "app.theme.dark": "Dark Mode"
            };
            return translations[key] || key;
        });
    });

    it("renders with light theme correctly", () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme
        });
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);

        render(<ThemeSwitcher />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toBeChecked();
        expect(switchElement).toHaveAttribute("aria-checked", "true");

        expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    });

    it("renders with dark theme correctly", () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: "dark",
            setTheme: mockSetTheme
        });
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);

        render(<ThemeSwitcher />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).not.toBeChecked();
        expect(switchElement).toHaveAttribute("aria-checked", "false");

        expect(screen.getByText("Light Mode")).toBeInTheDocument();
    });

    it("calls setTheme when switch is toggled from light to dark", () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme
        });
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);

        render(<ThemeSwitcher />);
        expect(mockTranslate).toHaveBeenCalledWith("app.theme.dark");

        const switchElement = screen.getByRole("switch");
        fireEvent.click(switchElement);

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
        expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    });

    it("calls setTheme when switch is toggled from dark to light", () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: "dark",
            setTheme: mockSetTheme
        });
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);

        render(<ThemeSwitcher />);
        expect(mockTranslate).toHaveBeenCalledWith("app.theme.light");

        const switchElement = screen.getByRole("switch");
        fireEvent.click(switchElement);

        expect(mockSetTheme).toHaveBeenCalledWith("light");
        expect(screen.getByText("Light Mode")).toBeInTheDocument();
    });

    it("renders with correct layout structure", () => {
        (useTheme as jest.Mock).mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme
        });
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);

        const { container } = render(<ThemeSwitcher />);

        const containerDiv = container.firstChild;
        expect(containerDiv).toHaveClass("flex");
        expect(containerDiv).toHaveClass("content-start");
        expect(containerDiv).toHaveClass("items-center");

        expect(screen.getByRole("switch")).toBeInTheDocument();
        expect(screen.getByText("Dark Mode")).toBeInTheDocument();
    });
});
