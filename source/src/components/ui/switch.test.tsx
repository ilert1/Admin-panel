import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "./switch";

describe("Switch", () => {
    it("renders without crashing", () => {
        render(<Switch />);
        expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
        const ref = createRef<HTMLButtonElement>();
        render(<Switch ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current).toBe(screen.getByRole("switch"));
    });

    it("applies custom className", () => {
        const customClass = "custom-switch";
        render(<Switch className={customClass} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toHaveClass(customClass);
    });

    it("handles checked state correctly", () => {
        render(<Switch checked={true} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toBeChecked();
    });

    it("handles unchecked state correctly", () => {
        render(<Switch checked={false} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).not.toBeChecked();
    });

    it("handles default checked state", () => {
        render(<Switch defaultChecked={true} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toBeChecked();
    });

    it("calls onChange when toggled", () => {
        const handleChange = jest.fn();
        render(<Switch onCheckedChange={handleChange} />);

        const switchElement = screen.getByRole("switch");
        fireEvent.click(switchElement);

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("handles disabled state", () => {
        render(<Switch disabled />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toBeDisabled();
    });

    it("applies correct accessibility attributes when disabled", () => {
        render(<Switch disabled />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toHaveAttribute("disabled");
    });

    it("has proper ARIA attributes", () => {
        render(<Switch />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toHaveAttribute("aria-checked");
        expect(switchElement).toHaveAttribute("role", "switch");
    });

    it("applies correct styles for checked state", () => {
        render(<Switch checked={true} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement.className).toContain("data-[state=checked]");
    });

    it("applies correct styles for unchecked state", () => {
        render(<Switch checked={false} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement.className).toContain("data-[state=unchecked]");
    });

    it("renders thumb element", () => {
        render(<Switch />);

        const switchElement = screen.getByRole("switch");
        const thumb = switchElement.querySelector("[data-state]");
        expect(thumb).toBeInTheDocument();
    });

    it("thumb moves correctly when toggled", () => {
        const { rerender } = render(<Switch checked={false} />);

        const switchElement = screen.getByRole("switch");
        const thumb = switchElement.querySelector("[data-state]");
        const initialTransform = thumb?.getAttribute("class")?.includes("translate-x-0");

        rerender(<Switch checked={true} />);

        const newTransform = thumb?.getAttribute("class")?.includes("translate-x-5");
        expect(newTransform).toBe(true);
        expect(initialTransform).toBe(true);
    });

    it("handles controlled component behavior", () => {
        const { rerender } = render(<Switch checked={false} />);

        let switchElement = screen.getByRole("switch");
        expect(switchElement).not.toBeChecked();

        rerender(<Switch checked={true} />);

        switchElement = screen.getByRole("switch");
        expect(switchElement).toBeChecked();
    });

    it("handles uncontrolled component behavior", () => {
        render(<Switch defaultChecked={true} />);

        const switchElement = screen.getByRole("switch");
        expect(switchElement).toBeChecked();
    });

    it("applies focus styles correctly", () => {
        render(<Switch />);

        const switchElement = screen.getByRole("switch");
        fireEvent.focus(switchElement);

        expect(switchElement.className).toContain("focus-visible");
    });
});
