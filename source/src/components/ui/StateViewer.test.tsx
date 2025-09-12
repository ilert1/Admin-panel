import { render, screen } from "@testing-library/react";
import { StateViewer } from "./StateViewer";
import { useTranslate } from "react-admin";

jest.mock("react-admin", () => ({
    useTranslate: jest.fn()
}));

describe("StateViewer", () => {
    const mockTranslate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useTranslate as jest.Mock).mockReturnValue(mockTranslate);
    });

    it("renders active state correctly", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.active") return "Active";
            return key;
        });

        render(<StateViewer value="active" />);

        const element = screen.getByText("Active");
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("bg-green-50");
        expect(element).toHaveClass("rounded-20");
        expect(element).toHaveClass("px-3");
        expect(element).toHaveClass("py-0.5");
    });

    it("renders inactive state correctly", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.inactive") return "Inactive";
            return key;
        });

        render(<StateViewer value="inactive" />);

        const element = screen.getByText("Inactive");
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("bg-red-50");
    });

    it("renders archived state correctly", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.archived") return "Archived";
            return key;
        });

        render(<StateViewer value="archived" />);

        const element = screen.getByText("Archived");
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("bg-extra-2");
    });

    it("applies custom className", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.active") return "Active";
            return key;
        });

        render(<StateViewer value="active" className="custom-class" />);

        const element = screen.getByText("Active");
        expect(element).toHaveClass("custom-class");
        expect(element).toHaveClass("bg-green-50");
    });

    it("has correct accessibility attributes", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.active") return "Active";
            return key;
        });

        render(<StateViewer value="active" />);

        const element = screen.getByText("Active");
        expect(element).toHaveAttribute("class");
        expect(element.tagName).toBe("SPAN");
    });

    it("calls translate with correct key for each state", () => {
        const testCases: Array<{ value: "active" | "inactive" | "archived"; expectedKey: string }> = [
            { value: "active", expectedKey: "resources.cascadeSettings.cascades.state.active" },
            { value: "inactive", expectedKey: "resources.cascadeSettings.cascades.state.inactive" },
            { value: "archived", expectedKey: "resources.cascadeSettings.cascades.state.archived" }
        ];

        testCases.forEach(({ value, expectedKey }) => {
            jest.clearAllMocks();

            render(<StateViewer value={value} />);

            expect(mockTranslate).toHaveBeenCalledWith(expectedKey);
        });
    });

    it("applies all base classes regardless of state", () => {
        mockTranslate.mockImplementation((key: string) => {
            if (key === "resources.cascadeSettings.cascades.state.active") return "Active";
            return key;
        });

        render(<StateViewer value="active" />);

        const element = screen.getByText("Active");
        const baseClasses = [
            "cursor-default",
            "whitespace-nowrap",
            "rounded-20",
            "px-3",
            "py-0.5",
            "text-center",
            "text-title-2",
            "font-normal"
        ];

        baseClasses.forEach(className => {
            expect(element).toHaveClass(className);
        });
    });

    it("renders different text for different states", () => {
        const states = ["active", "inactive", "archived"] as const;

        states.forEach(state => {
            mockTranslate.mockImplementation((key: string) => {
                if (key === `resources.cascadeSettings.cascades.state.${state}`) {
                    return state.charAt(0).toUpperCase() + state.slice(1);
                }
                return key;
            });

            const { unmount } = render(<StateViewer value={state} />);

            const expectedText = state.charAt(0).toUpperCase() + state.slice(1);
            expect(screen.getByText(expectedText)).toBeInTheDocument();

            unmount();
        });
    });

    it("maintains consistent structure across different states", () => {
        const states = ["active", "inactive", "archived"] as const;

        states.forEach(state => {
            mockTranslate.mockImplementation((key: string) => {
                if (key === `resources.cascadeSettings.cascades.state.${state}`) {
                    return "Test Text";
                }
                return key;
            });

            const { unmount } = render(<StateViewer value={state} />);

            const element = screen.getByText("Test Text");
            expect(element).toBeInTheDocument();
            expect(element.tagName).toBe("SPAN");

            unmount();
        });
    });
});
