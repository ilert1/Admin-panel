import { render, screen } from "@testing-library/react";
import { Text } from "./text";

describe("Text", () => {
    it("renders text content correctly", () => {
        const testText = "Hello World";
        render(<Text text={testText} className="test-class" />);

        expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it("applies custom className", () => {
        const customClass = "custom-text-class";
        render(<Text text="Test" className={customClass} />);

        const textElement = screen.getByText("Test");
        expect(textElement).toHaveClass(customClass);
    });

    it("forwards additional HTML attributes", () => {
        render(
            <Text text="Test" className="test-class" id="test-id" data-testid="custom-testid" aria-label="Test label" />
        );

        const textElement = screen.getByText("Test");
        expect(textElement).toHaveAttribute("id", "test-id");
        expect(textElement).toHaveAttribute("data-testid", "custom-testid");
        expect(textElement).toHaveAttribute("aria-label", "Test label");
    });

    it("renders as span element", () => {
        render(<Text text="Test" className="test-class" />);

        const textElement = screen.getByText("Test");
        expect(textElement.tagName).toBe("SPAN");
    });

    it("handles empty text string", () => {
        render(<Text text="" className="test-class" data-testid="custom-testid" />);

        const textElement = screen.getByTestId("custom-testid");
        expect(textElement).toBeInTheDocument();
        expect(textElement).toBeEmptyDOMElement();
    });

    it("handles text with special characters", () => {
        const specialText = 'Text with <>&" special characters';
        render(<Text text={specialText} className="test-class" />);

        expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it("handles long text content", () => {
        const longText =
            "This is a very long text content that should be rendered properly without any issues or truncation";
        render(<Text text={longText} className="test-class" />);

        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("merges custom className with potential additional classes", () => {
        render(<Text text="Test" className="base-class additional-class" />);

        const textElement = screen.getByText("Test");
        expect(textElement).toHaveClass("base-class");
        expect(textElement).toHaveClass("additional-class");
    });

    it("supports all span element attributes", () => {
        render(
            <Text
                text="Test"
                className="test-class"
                style={{ color: "rgb(255, 0, 0)", fontSize: "16px" }}
                title="Tooltip text"
                role="status"
            />
        );

        const textElement = screen.getByText("Test");
        expect(textElement).toHaveStyle({ color: "rgb(255, 0, 0)", fontSize: "16px" });
        expect(textElement).toHaveAttribute("title", "Tooltip text");
        expect(textElement).toHaveAttribute("role", "status");
    });

    it("handles numeric text content", () => {
        render(<Text text="123" className="test-class" />);

        expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("is accessible with proper semantic markup", () => {
        render(<Text text="Accessible text" className="test-class" />);

        const textElement = screen.getByText("Accessible text");
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveAttribute("class");
    });

    it("can be selected by text content", () => {
        render(<Text text="Unique text content" className="test-class" />);

        expect(screen.getByText("Unique text content")).toBeInTheDocument();
        expect(screen.queryByText("Non-existent text")).not.toBeInTheDocument();
    });
});
