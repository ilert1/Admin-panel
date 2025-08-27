import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangePicker } from "./date-range-picker";
import { DateRange } from "react-day-picker";

describe("DateRangePicker", () => {
    const placeholder = "Select date";
    const title = "Test Picker";

    const setup = (dateRange?: DateRange, onChange = jest.fn()) => {
        return render(
            <DateRangePicker title={title} placeholder={placeholder} dateRange={dateRange} onChange={onChange} />
        );
    };

    test("renders with placeholder when no date selected", () => {
        setup();
        expect(screen.getByText(placeholder)).toBeInTheDocument();
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    test("renders selected single date", () => {
        const date = new Date(2024, 1, 10);
        setup({ from: date, to: date });
        expect(screen.getByText(date.toLocaleDateString("en-US"))).toBeInTheDocument();
    });

    test("renders selected date range", () => {
        const from = new Date(2024, 1, 10);
        const to = new Date(2024, 1, 15);
        setup({ from, to });
        expect(
            screen.getByText(`${from.toLocaleDateString("en-US")} - ${to.toLocaleDateString("en-US")}`)
        ).toBeInTheDocument();
    });

    test("opens popover on button click", () => {
        setup();
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("clears selection on click clear-btn", () => {
        const from = new Date(2024, 1, 10);
        const to = new Date(2024, 1, 15);
        const onChange = jest.fn();
        setup({ from, to }, onChange);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByTestId("clear-btn"));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });

    test("toggles time selection on checkbox", () => {
        const from = new Date(2024, 1, 10);
        const to = new Date(2024, 1, 11);
        const onChange = jest.fn();
        setup({ from, to }, onChange);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByLabelText(/timePickerShow/i));
        expect(onChange).toHaveBeenCalled();
    });

    test("sets default times when enabling time without dates", () => {
        const onChange = jest.fn();
        setup(undefined, onChange);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByLabelText(/timePickerShow/i));

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                from: expect.any(Date),
                to: expect.any(Date)
            })
        );
    });

    test("updates start time correctly", () => {
        const from = new Date(2024, 1, 10, 10, 0);
        const to = new Date(2024, 1, 10, 10, 0);
        const onChange = jest.fn();
        setup({ from, to }, onChange);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByLabelText(/timePickerShow/i));

        const timeInputs = screen.getAllByRole("textbox");
        fireEvent.change(timeInputs[0], { target: { value: "15:30" } });

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                from: expect.any(Date),
                to: expect.any(Date)
            })
        );
    });

    test("shows error if start and end times are equal", () => {
        const from = new Date(2024, 1, 10, 10, 0);
        const to = new Date(2024, 1, 10, 10, 0);
        setup({ from, to });

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByLabelText(/timePickerShow/i));

        expect(screen.getByText(/timePickerErrorTitle/i)).toBeInTheDocument();
    });

    test("resets state when dateRange becomes undefined", () => {
        const { rerender } = render(
            <DateRangePicker
                placeholder={placeholder}
                dateRange={{ from: new Date(), to: new Date() }}
                onChange={jest.fn()}
            />
        );

        rerender(<DateRangePicker placeholder={placeholder} dateRange={undefined} onChange={jest.fn()} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.queryByLabelText(/timePickerShow/i)).toBeInTheDocument();
    });
});
