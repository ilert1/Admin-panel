import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, pagination = true }: DataTableProps<TData, TValue>) {
    const translate = useTranslate();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, i) => (
                        <TableRow key={i}>
                            {headerGroup.headers.map((header, j) => {
                                return (
                                    <TableHead key={j}>
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
                            <TableRow key={i} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell, j) => (
                                    <TableCell key={j}>
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
            {pagination && (
                <div className="flex items-center justify-end space-x-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        {translate("app.ui.pagination.previous")}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        {translate("app.ui.pagination.next")}
                    </Button>
                </div>
            )}
        </div>
    );
}
