import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input, InputTypes } from "./input";
import { useState } from "react";

jest.mock("../toast/useAppToast", () => ({
    useAppToast: () => jest.fn()
}));

jest.mock("react-admin", () => ({
    useTranslate: () => (key: string) => key
}));

jest.mock("./ErrorBadge");
jest.mock("./EyeButton");
jest.mock("./ClearButton");

describe("Input component", () => {
    it("renders with value", () => {
        render(<Input value="test" onChange={() => {}} />);
        expect(screen.getByRole("textbox")).toHaveValue("test");
    });

    it("calls onChange for controlled input", async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        render(<Input value="123" onChange={handleChange} />);

        const input = screen.getByRole("textbox");
        await user.type(input, "4");
        expect(handleChange).toHaveBeenCalled();
    });

    it("focus and blur behavior", async () => {
        const user = userEvent.setup();
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();
        render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

        const input = screen.getByRole("textbox");
        await user.click(input);
        expect(handleFocus).toHaveBeenCalled();

        await user.tab();
        expect(handleBlur).toHaveBeenCalled();
    });

    it("shows and clears value with ClearButton", async () => {
        const user = userEvent.setup();
        const Wrapper = () => {
            const [val, setVal] = useState("abc");
            return <Input value={val} onChange={e => setVal(e.target.value)} />;
        };
        render(<Wrapper />);

        const input = screen.getByRole("textbox");
        await user.click(input);
        const clearBtn = await screen.findByTestId("clear-button");
        await user.click(clearBtn);
        expect(input).toHaveValue("");
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        render(<Input type="password" value="secret" />);

        const eyeBtn = screen.getByTestId("eye-button");
        const input = screen.getByDisplayValue("secret");
        expect(input).toHaveAttribute("type", "password");

        await user.click(eyeBtn);
        expect(input).toHaveAttribute("type", "text");
    });

    it("copies value on copy icon click", async () => {
        const user = userEvent.setup();
        const mockWriteText = jest.fn().mockResolvedValue(undefined);

        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: mockWriteText },
            writable: true
        });
        render(<Input copyValue value="copy" />);

        const copyIcon = await screen.findByTestId("copy-btn");
        await user.click(copyIcon);
        expect(mockWriteText).toHaveBeenCalledWith("copy");
    });

    it("handles cut correctly", () => {
        const handleChange = jest.fn();
        render(<Input value="abcdef" onChange={handleChange} />);

        const input = screen.getByRole("textbox") as HTMLInputElement;
        Object.defineProperty(input, "selectionStart", { value: 1, configurable: true });
        Object.defineProperty(input, "selectionEnd", { value: 3, configurable: true });

        fireEvent.cut(input, {
            clipboardData: {
                setData: jest.fn()
            }
        });

        expect(handleChange).toHaveBeenCalled();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("bc");
    });

    it("renders error and ErrorBadge", () => {
        render(<Input error errorMessage="Invalid" />);
        expect(screen.getByTestId("error-badge")).toHaveTextContent("Invalid");

        const errorMessages = screen.getAllByText("Invalid");
        expect(errorMessages).toHaveLength(2);
    });

    it("applies percentage suffix", () => {
        render(<Input percentage value="50" />);
        expect(screen.getByText("%")).toBeInTheDocument();
    });

    it("applies variant and border color", () => {
        const { container } = render(<Input variant={InputTypes.GRAY} borderColor="border-neutral-60" />);
        expect(container.firstChild).toMatchSnapshot();
    });

    it("disables context menu for password_masked", async () => {
        const user = userEvent.setup();
        const onContextMenu = jest.fn();
        render(<Input type="password_masked" onContextMenu={onContextMenu} />);

        const input = screen.getByRole("textbox");
        await user.pointer({ target: input, keys: "[MouseRight]" });
        expect(onContextMenu).not.toHaveBeenCalled();
    });
});
