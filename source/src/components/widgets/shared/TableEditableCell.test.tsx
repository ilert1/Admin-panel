import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableEditableCell } from "./TableEditableCell";
import { Cell } from "@tanstack/react-table";

describe("TableEditableCell", () => {
    const mockCell = {
        row: { index: 1 },
        column: { getIndex: () => 2 }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as Cell<any, unknown>;

    const mockSetShowEdit = jest.fn();
    const mockOnSubmit = jest.fn();

    const defaultProps = {
        initValue: "Initial Value",
        cell: mockCell,
        showEdit: false,
        setShowEdit: mockSetShowEdit,
        onSubmit: mockOnSubmit,
        isFetching: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Display mode (showEdit: false)", () => {
        it("renders TextField with initial value in display mode", () => {
            render(<TableEditableCell {...defaultProps} />);

            expect(screen.getByText("Initial Value")).toBeInTheDocument();
            expect(screen.getByTestId("pencil-icon")).toBeInTheDocument();
        });

        it("calls setShowEdit when pencil button is clicked", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...defaultProps} />);

            const pencilButton = screen.getByRole("button");
            await user.click(pencilButton);

            expect(mockSetShowEdit).toHaveBeenCalledWith({ row: 1, column: 2 });
        });

        it("calls setShowEdit on TextField double click", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...defaultProps} />);

            const textField = screen.getByText("Initial Value");
            await user.dblClick(textField);

            expect(mockSetShowEdit).toHaveBeenCalledWith({ row: 1, column: 2 });
        });
    });

    describe("Edit mode (showEdit: true)", () => {
        const editModeProps = {
            ...defaultProps,
            showEdit: true
        };

        it("renders input field with initial value in edit mode", () => {
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            expect(input).toBeInTheDocument();
            expect(input).toHaveFocus();
        });

        it("updates input value when typing", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.clear(input);
            await user.type(input, "New Value");

            expect(input).toHaveValue("New Value");
        });

        it("calls onSubmit with trimmed value when Check button is clicked", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.clear(input);
            await user.type(input, "  New Value  ");

            const checkButton = screen.getByTestId("check-icon").closest("button");
            await user.click(checkButton!);

            expect(mockOnSubmit).toHaveBeenCalledWith("New Value");
        });

        it("calls onSubmit on Enter key press", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.clear(input);
            await user.type(input, "New Value{enter}");

            expect(mockOnSubmit).toHaveBeenCalledWith("New Value");
        });

        it("calls setShowEdit with undefined on Escape key press", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.type(input, "{escape}");

            expect(mockSetShowEdit).toHaveBeenCalledWith({ row: undefined, column: undefined });
        });

        it("calls setShowEdit with undefined and resets value when X button is clicked", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...editModeProps} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.clear(input);
            await user.type(input, "Modified Value");

            const xButton = screen.getByTestId("x-icon").closest("button");
            await user.click(xButton!);

            expect(mockSetShowEdit).toHaveBeenCalledWith({ row: undefined, column: undefined });
            expect(input).toHaveValue("Initial Value");
        });
    });

    describe("Loading state", () => {
        it("shows loading spinner instead of action buttons when isFetching is true", () => {
            render(<TableEditableCell {...defaultProps} showEdit={true} isFetching={true} />);

            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
            expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
        });
    });

    describe("Focus management", () => {
        it("focuses and selects input when entering edit mode", async () => {
            const { rerender } = render(<TableEditableCell {...defaultProps} />);
            expect(screen.queryByDisplayValue("Initial Value")).not.toBeInTheDocument();

            rerender(<TableEditableCell {...defaultProps} showEdit={true} />);

            const input = screen.getByDisplayValue("Initial Value");
            await waitFor(() => {
                expect(input).toHaveFocus();
                expect(input).toHaveValue("Initial Value");
            });
        });
    });

    describe("Edge cases", () => {
        it("handles empty initial value", () => {
            render(<TableEditableCell {...defaultProps} showEdit={true} initValue="" />);
            expect(screen.getByRole("textbox")).toHaveTextContent("");
        });

        it("trims whitespace when submitting", async () => {
            const user = userEvent.setup();
            render(<TableEditableCell {...defaultProps} showEdit={true} />);

            const input = screen.getByDisplayValue("Initial Value");
            await user.clear(input);
            await user.type(input, "   Value with spaces   ");

            const checkButton = screen.getByTestId("check-icon").closest("button");
            await user.click(checkButton!);

            expect(mockOnSubmit).toHaveBeenCalledWith("Value with spaces");
        });

        it("maintains value state when toggling edit mode", async () => {
            const { rerender } = render(<TableEditableCell {...defaultProps} />);
            rerender(<TableEditableCell {...defaultProps} showEdit={true} />);

            const input = screen.getByDisplayValue("Initial Value");
            fireEvent.change(input, { target: { value: "Modified Value" } });
            rerender(<TableEditableCell {...defaultProps} showEdit={false} />);
            rerender(<TableEditableCell {...defaultProps} showEdit={true} />);

            expect(screen.getByDisplayValue("Modified Value")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has proper button labels and roles", () => {
            render(<TableEditableCell {...defaultProps} />);

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(1);

            render(<TableEditableCell {...defaultProps} showEdit={true} />);
            const editModeButtons = screen.getAllByRole("button");
            expect(editModeButtons.length).toBeGreaterThan(1);
        });
    });
});
