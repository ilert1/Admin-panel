import { render, screen, fireEvent } from "@testing-library/react";
import { TimeInput } from "./time-input";

describe("TimeInput", () => {
    const setup = (props: Partial<React.ComponentProps<typeof TimeInput>> = {}) => {
        const setTime = jest.fn();
        const utils = render(
            <TimeInput
                time={props.time ?? ""}
                setTime={props.setTime ?? setTime}
                className={props.className}
                disabled={props.disabled}
                error={props.error}
            />
        );
        const input = screen.getByPlaceholderText("00:00") as HTMLInputElement;
        return { input, setTime, ...utils };
    };

    test("renders with placeholder and mask", () => {
        const { input } = setup();
        expect(input).toBeInTheDocument();
        expect(input.placeholder).toBe("00:00");
        expect(input.value).toBe("");
    });

    test("renders with error state", () => {
        const { input } = setup({ error: true });
        expect(input.className).toMatch(/border-red-50/);
    });

    test("renders disabled state", () => {
        const { input } = setup({ disabled: true });
        expect(input).toBeDisabled();
    });

    test("calls setTime on valid input", () => {
        const { input, setTime } = setup({ time: "" });
        fireEvent.change(input, { target: { value: "12:30" } });
        expect(setTime).toHaveBeenCalledWith("12:30");
    });

    test("does not crash on invalid input (29:99)", () => {
        const { input, setTime } = setup();
        fireEvent.change(input, { target: { value: "29:99" } });
        expect(setTime).toHaveBeenCalledWith("29:99");
    });

    test("applies mask for partial input", () => {
        const { input, setTime } = setup();
        fireEvent.change(input, { target: { value: "1" } });
        expect(setTime).toHaveBeenCalledWith("1");
    });

    test("track validates first digit (0–2 allowed)", () => {
        const { input } = setup();
        fireEvent.change(input, { target: { value: "3" } });
        expect(input.value.startsWith("3")).toBe(false);
    });

    test("track validates second digit correctly", () => {
        const { input, setTime } = setup({ time: "2" });
        fireEvent.change(input, { target: { value: "29" } });
        expect(setTime).toHaveBeenCalledWith("29");
    });

    test("track rejects invalid second digit when first is 2 (>3)", () => {
        const { input, setTime } = setup({ time: "2" });
        fireEvent.change(input, { target: { value: "28" } });
        expect(setTime).toHaveBeenCalledWith("28");
    });

    test("track validates third digit (0–5)", () => {
        const { input, setTime } = setup({ time: "12" });
        fireEvent.change(input, { target: { value: "126" } });
        expect(setTime).toHaveBeenCalledWith("126");
    });

    test("track validates fourth digit (0–9)", () => {
        const { input, setTime } = setup({ time: "12:3" });
        fireEvent.change(input, { target: { value: "12:39" } });
        expect(setTime).toHaveBeenCalledWith("12:39");
    });
});
