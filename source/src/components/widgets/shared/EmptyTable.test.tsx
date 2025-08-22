import { render, screen } from "@testing-library/react";
import { EmptyTable } from "./EmptyTable";
import { ColumnDef } from "@tanstack/react-table";

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

describe("EmptyTable", () => {
    const mockColumns: ColumnDef<{ id: string; name: string }, unknown>[] = [
        {
            accessorKey: "id",
            header: "ID"
        },
        {
            accessorKey: "name",
            header: "Name"
        }
    ];

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
            configurable: true,
            value: jest.fn()
        });
    });

    it("renders without crashing", () => {
        render(<EmptyTable columns={mockColumns} />);

        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("displays the correct empty state message", () => {
        render(<EmptyTable columns={mockColumns} />);
        expect(screen.getByText("resources.transactions.undefined")).toBeInTheDocument();
    });

    it("renders table headers based on provided columns", () => {
        render(<EmptyTable columns={mockColumns} />);

        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders pagination controls with correct translation", () => {
        render(<EmptyTable columns={mockColumns} />);
        expect(screen.getByText("resources.transactions.pagination")).toBeInTheDocument();
    });

    it("has correct column span for empty message cell", () => {
        const { container } = render(<EmptyTable columns={mockColumns} />);

        const emptyCell = container.querySelector("tbody td");
        expect(emptyCell).toHaveAttribute("colspan", mockColumns.length.toString());
    });

    it("maintains proper table structure with header and body", () => {
        const { container } = render(<EmptyTable columns={mockColumns} />);

        const thead = container.querySelector("thead");
        const tbody = container.querySelector("tbody");

        expect(thead).toBeInTheDocument();
        expect(tbody).toBeInTheDocument();

        const headerRows = thead?.querySelectorAll("tr");
        const bodyRows = tbody?.querySelectorAll("tr");

        expect(headerRows).toHaveLength(1);
        expect(bodyRows).toHaveLength(1);
    });

    it("applies dark mode classes correctly", () => {
        const { container } = render(<EmptyTable columns={mockColumns} />);

        const headerCells = container.querySelectorAll("thead th");
        headerCells.forEach(cell => {
            expect(cell).toHaveClass("dark:border-muted");
        });

        const emptyCell = container.querySelector("tbody td");
        expect(emptyCell).toHaveClass("dark:bg-black", "dark:text-neutral-30");
    });
});
