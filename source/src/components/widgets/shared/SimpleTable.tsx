import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslate } from "react-admin";
import { cn } from "@/lib/utils";

interface SimpleTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableType?: TableTypes;
    className?: string;
}

export enum TableTypes {
    DEFAULT = "default",
    COLORED = "colored"
}

export function SimpleTable<TData, TValue>({
    columns,
    data,
    tableType = TableTypes.DEFAULT,
    className = ""
}: SimpleTableProps<TData, TValue>) {
    const translate = useTranslate();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <Table className={className}>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup, i) => (
                    <TableRow className="relative" key={i}>
                        {headerGroup.headers.map((header, j) => {
                            return (
                                <TableHead
                                    key={j}
                                    className={
                                        tableType === TableTypes.COLORED
                                            ? "bg-green-50 text-neutral-0 border border-x border-muted"
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
                                    ? cn(
                                          "text-neutral-100 border border-muted",
                                          i % 2
                                              ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                              : "bg-neutral-0 dark:bg-neutral-100"
                                      )
                                    : ""
                            }>
                            {row.getVisibleCells().map((cell, j) => (
                                <TableCell
                                    key={j}
                                    className={
                                        tableType === TableTypes.COLORED
                                            ? "border border-muted text-neutral-90 dark:text-neutral-0"
                                            : ""
                                    }>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            {translate("resources.transactions.undefined")}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
