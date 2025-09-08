import { render, screen } from "@testing-library/react";
import { SimpleTable, TableTypes } from "./SimpleTable";
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

describe("SimpleTable", () => {
    const mockData = [
        { id: "1", name: "Item 1", value: 100 },
        { id: "2", name: "Item 2", value: 200 }
    ];

    const mockColumns: ColumnDef<(typeof mockData)[0], unknown>[] = [
        {
            accessorKey: "id",
            header: "ID"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "value",
            header: "Value"
        }
    ];

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "scrollTo", {
            configurable: true,
            value: jest.fn()
        });
    });

    describe("Basic rendering", () => {
        it("renders without crashing with data", () => {
            render(<SimpleTable columns={mockColumns} data={mockData} />);
            expect(screen.getByRole("table")).toBeInTheDocument();
        });

        it("renders without crashing with empty data", () => {
            render(<SimpleTable columns={mockColumns} data={[]} />);
            expect(screen.getByRole("table")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            render(<SimpleTable columns={mockColumns} data={mockData} className="custom-table" />);
            expect(document.querySelector(".custom-table")).toBeInTheDocument();
        });
    });

    describe("Header rendering", () => {
        it("renders all column headers", () => {
            render(<SimpleTable columns={mockColumns} data={mockData} />);

            expect(screen.getByText("ID")).toBeInTheDocument();
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Value")).toBeInTheDocument();
        });

        it("applies colored styling to headers when tableType is COLORED", () => {
            const { container } = render(
                <SimpleTable columns={mockColumns} data={mockData} tableType={TableTypes.COLORED} />
            );

            const headerCells = container.querySelectorAll("thead th");
            headerCells.forEach(cell => {
                expect(cell).toHaveClass("border");
                expect(cell).toHaveClass("border-x");
                expect(cell).toHaveClass("border-neutral-40");
                expect(cell).toHaveClass("bg-green-50");
                expect(cell).toHaveClass("text-neutral-0");
                expect(cell).toHaveClass("dark:border-muted");
            });
        });

        it("does not apply colored styling to headers when tableType is DEFAULT", () => {
            const { container } = render(
                <SimpleTable columns={mockColumns} data={mockData} tableType={TableTypes.DEFAULT} />
            );

            const headerCells = container.querySelectorAll("thead th");
            headerCells.forEach(cell => {
                expect(cell).not.toHaveClass("border");
                expect(cell).not.toHaveClass("border-x");
                expect(cell).not.toHaveClass("bg-green-50");
            });
        });
    });

    describe("Data rendering", () => {
        it("renders all data rows and cells", () => {
            render(<SimpleTable columns={mockColumns} data={mockData} />);

            expect(screen.getByText("Item 1")).toBeInTheDocument();
            expect(screen.getByText("Item 2")).toBeInTheDocument();
            expect(screen.getByText("100")).toBeInTheDocument();
            expect(screen.getByText("200")).toBeInTheDocument();
        });

        it("applies colored styling to rows and cells when tableType is COLORED", () => {
            const { container } = render(
                <SimpleTable columns={mockColumns} data={mockData} tableType={TableTypes.COLORED} />
            );

            const rows = container.querySelectorAll("tbody tr");
            expect(rows).toHaveLength(2);

            expect(rows[0]).toHaveClass("border");
            expect(rows[0]).toHaveClass("border-neutral-40");
            expect(rows[0]).toHaveClass("text-neutral-100");
            expect(rows[0]).toHaveClass("dark:border-muted");
            expect(rows[0]).toHaveClass("bg-neutral-0");
            expect(rows[0]).toHaveClass("dark:bg-neutral-100");

            expect(rows[1]).toHaveClass("bg-neutral-20");
            expect(rows[1]).toHaveClass("dark:bg-neutral-bb-2");

            const cells = container.querySelectorAll("tbody td");
            cells.forEach(cell => {
                expect(cell).toHaveClass("border");
                expect(cell).toHaveClass("border-neutral-40");
                expect(cell).toHaveClass("text-neutral-90");
                expect(cell).toHaveClass("dark:border-muted");
                expect(cell).toHaveClass("dark:text-neutral-0");
            });
        });

        it("does not apply colored styling to rows and cells when tableType is DEFAULT", () => {
            const { container } = render(
                <SimpleTable columns={mockColumns} data={mockData} tableType={TableTypes.DEFAULT} />
            );

            const rows = container.querySelectorAll("tbody tr");
            rows.forEach(row => {
                expect(row).not.toHaveClass("border");
                expect(row).not.toHaveClass("border-neutral-40");
            });

            const cells = container.querySelectorAll("tbody td");
            cells.forEach(cell => {
                expect(cell).not.toHaveClass("border");
                expect(cell).not.toHaveClass("border-neutral-40");
            });
        });

        it("applies data-state attribute for selected rows", () => {
            const { container } = render(<SimpleTable columns={mockColumns} data={mockData} />);

            const rows = container.querySelectorAll("tbody tr");
            expect(rows[0]).toHaveAttribute("data-state");
        });
    });

    describe("Empty state handling", () => {
        it("displays default empty message when data is empty", () => {
            render(<SimpleTable columns={mockColumns} data={[]} />);
            expect(screen.getByText("resources.transactions.undefined")).toBeInTheDocument();
        });

        it("displays custom notFoundMessage when provided", () => {
            const customMessage = "Custom empty message";
            render(<SimpleTable columns={mockColumns} data={[]} notFoundMessage={customMessage} />);

            expect(screen.getByText(customMessage)).toBeInTheDocument();
            expect(screen.queryByText("resources.transactions.undefined")).not.toBeInTheDocument();
        });

        it("displays custom ReactNode notFoundMessage", () => {
            const customMessage = <div data-testid="custom-message">Custom ReactNode</div>;
            render(<SimpleTable columns={mockColumns} data={[]} notFoundMessage={customMessage} />);

            expect(screen.getByTestId("custom-message")).toBeInTheDocument();
        });

        it("empty state cell spans all columns", () => {
            const { container } = render(<SimpleTable columns={mockColumns} data={[]} />);

            const emptyCell = container.querySelector("tbody td");
            expect(emptyCell).toHaveAttribute("colspan", mockColumns.length.toString());
        });

        it("applies correct styling to empty state cell", () => {
            const { container } = render(<SimpleTable columns={mockColumns} data={[]} />);

            const emptyCell = container.querySelector("tbody td");
            expect(emptyCell).toHaveClass("h-24");
            expect(emptyCell).toHaveClass("bg-white");
            expect(emptyCell).toHaveClass("text-center");
            expect(emptyCell).toHaveClass("text-neutral-90");
            expect(emptyCell).toHaveClass("dark:bg-black");
            expect(emptyCell).toHaveClass("dark:text-neutral-30");
        });
    });

    describe("Accessibility and semantic structure", () => {
        it("has proper table structure with thead and tbody", () => {
            const { container } = render(<SimpleTable columns={mockColumns} data={mockData} />);

            const thead = container.querySelector("thead");
            const tbody = container.querySelector("tbody");

            expect(thead).toBeInTheDocument();
            expect(tbody).toBeInTheDocument();
            expect(thead?.querySelectorAll("tr")).toHaveLength(1);
            expect(tbody?.querySelectorAll("tr")).toHaveLength(2);
        });

        it("header has correct accessibility attributes", () => {
            const { container } = render(<SimpleTable columns={mockColumns} data={mockData} />);

            const table = container.querySelector("table");
            const header = container.querySelector("thead");

            expect(table).toBeInTheDocument();
            expect(header).toBeInTheDocument();
        });

        it("correct scrolling behavior for simpleTable", () => {
            render(<SimpleTable columns={mockColumns} data={mockData} />);

            const tableContainer = screen.getByTestId("table-container");

            expect(tableContainer).toHaveClass("max-h-96");
        });
    });

    describe("Edge cases", () => {
        it("handles empty columns array", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const emptyColumns: ColumnDef<any, any>[] = [];
            render(<SimpleTable columns={emptyColumns} data={[]} />);

            const emptyCell = screen.getByText("resources.transactions.undefined");
            expect(emptyCell).toBeInTheDocument();
        });

        it("handles columns with placeholder headers", () => {
            const columnsWithPlaceholders: ColumnDef<(typeof mockData)[0], unknown>[] = [
                {
                    accessorKey: "id",
                    header: "ID"
                },
                {
                    id: "placeholder",
                    header: () => null
                }
            ];

            render(<SimpleTable columns={columnsWithPlaceholders} data={mockData} />);

            expect(screen.getByRole("table")).toBeInTheDocument();
            expect(screen.getByText("ID")).toBeInTheDocument();
        });

        it("handles single item data array", () => {
            const singleItem = [mockData[0]];
            render(<SimpleTable columns={mockColumns} data={singleItem} />);

            expect(screen.getByText("Item 1")).toBeInTheDocument();
            expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
        });
    });
});
