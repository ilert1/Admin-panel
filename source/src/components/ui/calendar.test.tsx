import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar } from "./calendar";

jest.mock("react-admin", () => ({
    useTranslate: () => jest.fn((key: string) => key)
}));

describe("Calendar", () => {
    it("renders calendar with default props", () => {
        render(<Calendar />);
        expect(screen.getByTestId("calendar")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Calendar className="custom-class" />);
        expect(screen.getByTestId("calendar")).toHaveClass("custom-class");
    });

    it("renders chevrons correctly", () => {
        render(<Calendar />);
        expect(screen.getAllByRole("button").some(b => b.querySelector("svg"))).toBe(true);
    });

    it("opens and closes month dropdown", () => {
        render(<Calendar />);
        const trigger = screen.getAllByRole("button").find(b => b.textContent);
        expect(trigger).toBeInTheDocument();

        fireEvent.click(trigger!);
        expect(screen.getAllByRole("button", { name: /datePicker/ })?.[0]).toBeInTheDocument();

        const option = screen.getAllByRole("button").find(b => b.id);
        fireEvent.click(option!);
        expect(option).not.toBeVisible();
    });

    it("calls onSelect when a day is clicked", () => {
        const handleSelect = jest.fn();
        render(<Calendar mode="single" onSelect={handleSelect} />);

        const day = screen
            .getAllByRole("gridcell")
            .find(cell => cell.textContent)
            ?.querySelector("button");
        fireEvent.click(day!);

        expect(handleSelect).toHaveBeenCalled();
    });

    it("uses translations for month and day", () => {
        render(<Calendar mode="single" />);
        expect(screen.getByText(/datePicker\.month\./)).toBeInTheDocument();
        expect(screen.getAllByText(/datePicker\.day\./).length).toBeGreaterThan(0);
    });

    it("merges custom classNames", () => {
        render(<Calendar classNames={{ day: "my-day-class" }} />);
        const dayButton = screen.getAllByRole("gridcell")[0];
        expect(dayButton).toHaveClass("my-day-class");
    });
});
