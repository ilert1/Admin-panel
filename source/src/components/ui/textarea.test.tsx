import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./textarea";

describe("Textarea", () => {
    const user = userEvent.setup();

    describe("Basic rendering", () => {
        it("renders textarea with default props", () => {
            render(<Textarea />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeInTheDocument();
            expect(textarea).toBeEnabled();
            expect(textarea).not.toHaveAttribute("readonly");
        });

        it("forwards ref correctly", () => {
            const ref = React.createRef<HTMLTextAreaElement>();
            render(<Textarea ref={ref} />);

            expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
            expect(ref.current).toBe(screen.getByRole("textbox"));
        });
    });

    describe("Props handling", () => {
        it("applies readOnly prop correctly", () => {
            render(<Textarea readOnly />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("readonly");
        });

        it("applies placeholder", () => {
            const placeholder = "Enter text here";
            render(<Textarea placeholder={placeholder} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("placeholder", placeholder);
        });

        it("applies disabled state", () => {
            render(<Textarea disabled />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeDisabled();
        });

        it("applies all standard textarea attributes", () => {
            render(<Textarea id="test-id" name="test-name" rows={5} cols={40} maxLength={100} value="test value" />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("id", "test-id");
            expect(textarea).toHaveAttribute("name", "test-name");
            expect(textarea).toHaveAttribute("rows", "5");
            expect(textarea).toHaveAttribute("cols", "40");
            expect(textarea).toHaveAttribute("maxlength", "100");
            expect(textarea).toHaveValue("test value");
        });
    });

    describe("Error states", () => {
        it("does not show error elements when error is false", () => {
            render(<Textarea error={false} errorMessage="Error message" />);

            expect(screen.queryByText("Error message")).not.toBeInTheDocument();
        });

        it("shows error message when error is true and errorMessage provided", () => {
            const errorMessage = "This field is required";
            render(<Textarea error={true} errorMessage={errorMessage} />);

            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toHaveClass("text-red-40");
        });

        it("handles ReactNode error message", () => {
            const errorMessage = <div data-testid="custom-error">Custom error node</div>;
            render(<Textarea error={true} errorMessage={errorMessage} />);

            expect(screen.getByTestId("custom-error")).toBeInTheDocument();
            expect(screen.getByText("Custom error node")).toBeInTheDocument();
        });
    });

    describe("User interaction", () => {
        it("allows user input", async () => {
            render(<Textarea />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "Hello world");

            expect(textarea).toHaveValue("Hello world");
        });

        it("prevents input when readOnly", async () => {
            render(<Textarea readOnly value="Initial" />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "New text");

            expect(textarea).toHaveValue("Initial");
        });

        it("prevents input when disabled", async () => {
            render(<Textarea disabled value="Initial" />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "New text");

            expect(textarea).toHaveValue("Initial");
        });
    });

    describe("Accessibility", () => {
        it("has proper accessibility attributes", () => {
            render(<Textarea aria-label="Description" />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("aria-label", "Description");
        });

        it("maintains focus during interaction", async () => {
            render(<Textarea />);

            const textarea = screen.getByRole("textbox");
            await user.click(textarea);

            expect(textarea).toHaveFocus();
        });
    });

    describe("Layout and structure", () => {
        it("wraps textarea in container div", () => {
            const { container } = render(<Textarea />);

            const wrapperDiv = container.firstChild;
            expect(wrapperDiv).toBeInTheDocument();
            expect(wrapperDiv).toHaveClass("relative");
            expect(wrapperDiv).toHaveClass("flex");
            expect(wrapperDiv).toHaveClass("flex-col");
        });

        it("positions error message below textarea", () => {
            render(<Textarea error={true} errorMessage="Error" />);

            const textarea = screen.getByRole("textbox");
            const errorMessage = screen.getByText("Error");

            expect(textarea).toBeInTheDocument();
            expect(errorMessage).toBeInTheDocument();
            expect(textarea.parentNode).toContainElement(errorMessage);
        });
    });

    describe("Edge cases", () => {
        it("handles empty string error message", () => {
            render(<Textarea error={true} errorMessage="" />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("handles undefined error prop", () => {
            render(<Textarea error={undefined} errorMessage="Test" />);

            expect(screen.queryByText("Test")).not.toBeInTheDocument();
        });

        it("handles null error message", () => {
            render(<Textarea error={true} errorMessage={null} />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });
    });
});
