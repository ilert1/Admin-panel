import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SimpleTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableType?: TableTypes;
}

export enum TableTypes {
    DEFAULT = "default",
    COLORED = "colored"
}

export function SimpleTable<TData, TValue>({
    columns,
    data,
    tableType = TableTypes.DEFAULT
}: SimpleTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup, i) => (
                    <TableRow key={i}>
                        {headerGroup.headers.map((header, j) => {
                            return (
                                <TableHead
                                    key={j}
                                    className={
                                        tableType === TableTypes.COLORED
                                            ? "bg-green-50 text-neutral-100 border border-x border-muted"
                                            : ""
                                    }>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, i) => (
                        <TableRow
                            key={i}
                            data-state={row.getIsSelected() && "selected"}
                            className={
                                tableType === TableTypes.COLORED
                                    ? "bg-neutral-0 text-neutral-100 border border-muted"
                                    : ""
                            }>
                            {row.getVisibleCells().map((cell, j) => (
                                <TableCell
                                    key={j}
                                    className={tableType === TableTypes.COLORED ? "border border-muted" : ""}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
