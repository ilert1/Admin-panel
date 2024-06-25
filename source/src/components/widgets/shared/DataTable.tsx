import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListContext } from "react-admin";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    pagination?: boolean;
}

export function DataTable<TData, TValue>({ columns, pagination = true }: DataTableProps<TData, TValue>) {
    const { page, setPage, perPage, setPerPage, total, data } = useListContext();

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        rowCount: total,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: page - 1,
                pageSize: perPage
            }
        }
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
                <div className="flex w-full items-center justify-end gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
                    <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                        <div className="flex items-center space-x-2">
                            <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={value => {
                                    table.setPageSize(Number(value));
                                    setPerPage(Number(value));
                                }}>
                                <SelectTrigger className="h-8 w-[4.5rem]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[5, 10, 25, 50, 100].map(pageSize => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center text-sm font-medium">
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                aria-label="Go to first page"
                                variant="outline"
                                className="hidden size-8 p-0 lg:flex"
                                onClick={() => {
                                    table.setPageIndex(0);
                                    setPage(1);
                                }}
                                disabled={!table.getCanPreviousPage()}>
                                <ChevronsLeftIcon className="size-4" aria-hidden="true" />
                            </Button>
                            <Button
                                aria-label="Go to previous page"
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => {
                                    table.previousPage();
                                    setPage(page - 1);
                                }}
                                disabled={!table.getCanPreviousPage()}>
                                <ChevronLeftIcon className="size-4" aria-hidden="true" />
                            </Button>
                            <Button
                                aria-label="Go to next page"
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => {
                                    table.nextPage();
                                    setPage(page + 1);
                                }}
                                disabled={!table.getCanNextPage()}>
                                <ChevronRightIcon className="size-4" aria-hidden="true" />
                            </Button>
                            <Button
                                aria-label="Go to last page"
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:flex"
                                onClick={() => {
                                    table.setPageIndex(table.getPageCount() - 1);
                                    setPage(table.getPageCount());
                                }}
                                disabled={!table.getCanNextPage()}>
                                <ChevronsRightIcon className="size-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
