import { render, screen } from "@testing-library/react";
import { InitLoading, Loading, LoadingBlock, LoadingBalance, RingSpinner } from "./loading";
import { useTheme } from "../providers";

jest.mock("../providers", () => ({
    useTheme: jest.fn()
}));

describe("Loading Components", () => {
    const mockUseTheme = useTheme as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTheme.mockReturnValue({ theme: "light" });
    });

    describe("RingSpinner", () => {
        it("renders without crashing", () => {
            render(<RingSpinner />);
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("has correct SVG structure and attributes", () => {
            render(<RingSpinner />);

            const svg = screen.getByTestId("ring-spinner");
            expect(svg).toHaveClass("h-24");
            expect(svg).toHaveClass("w-24");
            expect(svg).toHaveClass("animate-spin");
            expect(svg).toHaveAttribute("viewBox", "0 0 100 100");

            const gradient = svg.querySelector("linearGradient");
            expect(gradient).toBeInTheDocument();
            expect(gradient).toHaveAttribute("id", "spinner-gradient");

            const circle = svg.querySelector("circle");
            expect(circle).toBeInTheDocument();
            expect(circle).toHaveAttribute("cx", "50");
            expect(circle).toHaveAttribute("cy", "50");
            expect(circle).toHaveAttribute("r", "45");
        });
    });

    describe("InitLoading", () => {
        it("renders without crashing with light theme", () => {
            mockUseTheme.mockReturnValue({ theme: "light" });

            render(<InitLoading />);

            expect(screen.getByTestId("init-loading")).toBeInTheDocument();
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("renders without crashing with dark theme", () => {
            mockUseTheme.mockReturnValue({ theme: "dark" });

            render(<InitLoading />);

            expect(screen.getByTestId("init-loading")).toBeInTheDocument();
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("applies correct background styles for light theme", () => {
            mockUseTheme.mockReturnValue({ theme: "light" });

            render(<InitLoading />);

            const container = screen.getByTestId("init-loading");
            expect(container).toHaveStyle({
                backgroundImage: 'url("/LoginBackgroundLight.svg")',
                backgroundColor: "#f2f2f2"
            });
        });

        it("applies correct background styles for dark theme", () => {
            mockUseTheme.mockReturnValue({ theme: "dark" });

            render(<InitLoading />);

            const container = screen.getByTestId("init-loading");
            expect(container).toHaveStyle({
                backgroundImage: 'url("/LoginBackground.svg")',
                backgroundColor: "rgba(19, 35, 44, 1)"
            });
        });

        it("has fixed positioning and flex layout", () => {
            render(<InitLoading />);

            const container = screen.getByTestId("init-loading");
            expect(container).toHaveClass("fixed");
            expect(container).toHaveClass("inset-0");
            expect(container).toHaveClass("flex");
            expect(container).toHaveClass("items-center");
            expect(container).toHaveClass("justify-center");
        });
    });

    describe("Loading", () => {
        it("renders without crashing", () => {
            render(<Loading />);

            expect(screen.getByTestId("loading")).toBeInTheDocument();
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            render(<Loading className="custom-loading" />);

            const container = screen.getByTestId("loading");
            expect(container).toHaveClass("custom-loading");
        });

        it("has absolute positioning and flex layout", () => {
            render(<Loading />);

            const container = screen.getByTestId("loading");
            expect(container).toHaveClass("absolute");
            expect(container).toHaveClass("inset-0");
            expect(container).toHaveClass("flex");
            expect(container).toHaveClass("items-center");
            expect(container).toHaveClass("justify-center");
        });
    });

    describe("LoadingBlock", () => {
        it("renders without crashing", () => {
            render(<LoadingBlock />);

            expect(screen.getByTestId("loading-block")).toBeInTheDocument();
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            render(<LoadingBlock className="custom-block" />);

            const container = screen.getByTestId("loading-block");
            expect(container).toHaveClass("custom-block");
        });

        it("has full dimensions and flex layout", () => {
            render(<LoadingBlock />);

            const container = screen.getByTestId("loading-block");
            expect(container).toHaveClass("h-full");
            expect(container).toHaveClass("w-full");
            expect(container).toHaveClass("flex");
            expect(container).toHaveClass("items-center");
            expect(container).toHaveClass("justify-center");
        });
    });

    describe("LoadingBalance", () => {
        it("renders without crashing", () => {
            render(<LoadingBalance />);

            expect(screen.getByTestId("loading-balance")).toBeInTheDocument();
            expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            render(<LoadingBalance className="custom-balance" />);

            const container = screen.getByTestId("loading-balance");
            expect(container).toHaveClass("custom-balance");
        });

        it("has flex layout", () => {
            render(<LoadingBalance />);

            const container = screen.getByTestId("loading-balance");
            expect(container).toHaveClass("flex");
            expect(container).toHaveClass("items-center");
            expect(container).toHaveClass("justify-center");
        });
    });

    describe("Theme handling", () => {
        it("handles undefined theme gracefully", () => {
            mockUseTheme.mockReturnValue({ theme: undefined });

            expect(() => {
                render(<InitLoading />);
            }).not.toThrow();

            expect(screen.getByTestId("init-loading")).toBeInTheDocument();
        });

        it("handles system theme by using light theme fallback", () => {
            mockUseTheme.mockReturnValue({ theme: "system" });

            render(<InitLoading />);

            const container = screen.getByTestId("init-loading");

            expect(container).toHaveStyle({
                backgroundImage: 'url("/LoginBackgroundLight.svg")'
            });
        });
    });

    describe("Consistency", () => {
        it("all loading components contain RingSpinner", () => {
            const components = [
                { Component: InitLoading, testId: "init-loading" },
                { Component: Loading, testId: "loading" },
                { Component: LoadingBlock, testId: "loading-block" },
                { Component: LoadingBalance, testId: "loading-balance" }
            ];

            components.forEach(({ Component, testId }) => {
                const { unmount } = render(<Component />);

                expect(screen.getByTestId(testId)).toBeInTheDocument();
                expect(screen.getByTestId("ring-spinner")).toBeInTheDocument();

                unmount();
            });
        });
    });
});
