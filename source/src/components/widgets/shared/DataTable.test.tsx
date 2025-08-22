import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "./DataTable";

jest.mock("react-admin", () => ({
    useListContext: jest.fn(() => ({
        data: [],
        total: 0,
        page: 1,
        perPage: 25,
        setPage: jest.fn(),
        setPerPage: jest.fn()
    })),
    useTranslate: () => (key: string) => key
}));

describe("DataTable", () => {
    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" }
    ];

    const data = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ];

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
            configurable: true,
            value: jest.fn()
        });
    });

    it("renders table headers and rows", () => {
        render(<DataTable columns={columns} data={data} total={data.length} />);
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("renders placeholder if no data", () => {
        render(<DataTable columns={columns} data={[]} total={0} placeholder="No data" />);
        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("uses translate fallback if placeholder not provided", () => {
        render(<DataTable columns={columns} data={[]} total={0} />);
        expect(screen.getByText("resources.transactions.undefined")).toBeInTheDocument();
    });

    it("disables previous/next buttons on first/last page", () => {
        const { rerender } = render(<DataTable columns={columns} data={data} total={50} page={1} perPage={25} />);
        const prevButton = screen.getByLabelText("Go to previous page") as HTMLButtonElement;
        const nextButton = screen.getByLabelText("Go to next page") as HTMLButtonElement;
        expect(prevButton).toBeDisabled();
        expect(nextButton).not.toBeDisabled();

        rerender(<DataTable columns={columns} data={data} total={50} page={2} perPage={25} />);
        const prevButton2 = screen.getByLabelText("Go to previous page") as HTMLButtonElement;
        const nextButton2 = screen.getByLabelText("Go to next page") as HTMLButtonElement;
        expect(prevButton2).not.toBeDisabled();
        expect(nextButton2).toBeDisabled();
    });

    it("calls setPage when page button clicked", () => {
        const setPage = jest.fn();
        render(<DataTable columns={columns} data={data} total={50} page={1} perPage={25} setPage={setPage} />);
        const page2Button = screen.getAllByRole("button").find(btn => btn.innerHTML === "2");
        fireEvent.click(page2Button!);
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it("renders pagination with ellipsis for many pages", () => {
        render(<DataTable columns={columns} data={data} total={200} page={1} perPage={25} />);
        expect(screen.getByText("...")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("renders perPage select and calls setPerPage on change", () => {
        const setPerPage = jest.fn();
        render(<DataTable columns={columns} data={data} total={50} page={1} perPage={25} setPerPage={setPerPage} />);

        // Нажатия в Select только таким образом
        fireEvent.keyDown(screen.getByRole("combobox"), {
            key: " "
        });
        const option = screen.getByText("50").parentElement;
        fireEvent.keyDown(option!, {
            key: " "
        });
        console.log(document.body.innerHTML);
        expect(setPerPage).toHaveBeenCalledWith(50);
    });

    it("handles pagination disabled", () => {
        render(<DataTable columns={columns} data={data} total={50} page={1} perPage={25} pagination={false} />);
        expect(screen.queryByLabelText("Go to previous page")).not.toBeInTheDocument();
    });

    it("handles data from context if total not provided", () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const useListContext = require("react-admin").useListContext;
        useListContext.mockReturnValue({
            data,
            total: 2,
            page: 1,
            perPage: 25,
            setPage: jest.fn(),
            setPerPage: jest.fn()
        });
        render(<DataTable columns={columns} />);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });
});
