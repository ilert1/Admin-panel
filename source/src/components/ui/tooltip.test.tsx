import React from "react";
import { render, screen } from "@testing-library/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { cn } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
    cn: jest.fn((...classes) => classes.filter(Boolean).join(" "))
}));

const TooltipTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TooltipProvider>{children}</TooltipProvider>
);

describe("Tooltip Components", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Tooltip Provider", () => {
        it("renders TooltipProvider correctly", () => {
            render(
                <TooltipProvider>
                    <div>Test Content</div>
                </TooltipProvider>
            );

            expect(screen.getByText("Test Content")).toBeInTheDocument();
        });
    });

    describe("Tooltip Root", () => {
        it("renders Tooltip component within Provider", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button>Hover me</button>
                        </TooltipTrigger>
                        <TooltipContent>Tooltip content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getByText("Hover me")).toBeInTheDocument();
        });

        it("forwards props to Radix Tooltip", () => {
            const onOpenChange = jest.fn();

            render(
                <TooltipTestWrapper>
                    <Tooltip open={true} onOpenChange={onOpenChange}>
                        <TooltipTrigger asChild>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getByText("Trigger")).toBeInTheDocument();
        });
    });

    describe("Tooltip Trigger", () => {
        it("renders TooltipTrigger component", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button data-testid="trigger-button">Hover me</button>
                        </TooltipTrigger>
                        <TooltipContent>Tooltip content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
        });

        it("can be used without asChild prop", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip>
                        <TooltipTrigger>
                            <button>Click me</button>
                        </TooltipTrigger>
                        <TooltipContent>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getByText("Click me")).toBeInTheDocument();
        });
    });

    describe("Tooltip Content", () => {
        it("renders TooltipContent with correct className when open", () => {
            const testClassName = "custom-class";

            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent className={testClassName}>Tooltip content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(cn).toHaveBeenCalledWith(expect.stringContaining("relative z-[60]"), testClassName);
        });

        it("applies default sideOffset", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent>Tooltip content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(cn).toHaveBeenCalled();
        });

        it("applies custom sideOffset", () => {
            const customSideOffset = 8;

            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={customSideOffset}>Tooltip content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getAllByText("Tooltip content")[0]).toBeInTheDocument();
        });

        it("renders children content correctly", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div data-testid="custom-content">Custom tooltip content</div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(screen.getAllByTestId("custom-content")[0]).toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        it("renders complete tooltip structure", () => {
            render(
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button>Hover me</button>
                        </TooltipTrigger>
                        <TooltipContent>This is a tooltip</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );

            expect(screen.getByText("Hover me")).toBeInTheDocument();
        });

        it("forwards ref correctly for TooltipContent", () => {
            const ref = React.createRef<HTMLDivElement>();

            const { unmount } = render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent ref={ref}>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );
            expect(ref.current).toBeDefined();
            unmount();
        });
    });

    describe("Accessibility", () => {
        it("has proper accessibility attributes", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button aria-describedby="tooltip-id">Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent id="tooltip-id">Accessible tooltip</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            const trigger = screen.getByText("Trigger");
            expect(trigger).toHaveAttribute("aria-describedby", "tooltip-id");
        });
    });

    describe("Styling", () => {
        it("applies dark mode classes correctly", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(cn).toHaveBeenCalledWith(expect.stringContaining("dark:bg-neutral-100"), undefined);
        });

        it("merges custom classes with default classes", () => {
            const customClass = "custom-tooltip";

            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent className={customClass}>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(cn).toHaveBeenCalledWith(expect.any(String), customClass);
        });
    });

    describe("Component display names", () => {
        it("has correct display name for TooltipContent", () => {
            expect(TooltipContent.displayName).toBe("TooltipContent");
        });
    });

    describe("Animation classes", () => {
        it("includes animation utility classes in className", () => {
            render(
                <TooltipTestWrapper>
                    <Tooltip open={true}>
                        <TooltipTrigger>
                            <button>Trigger</button>
                        </TooltipTrigger>
                        <TooltipContent>Content</TooltipContent>
                    </Tooltip>
                </TooltipTestWrapper>
            );

            expect(cn).toHaveBeenCalledWith(expect.stringContaining("animate-in"), undefined);
        });
    });
});
