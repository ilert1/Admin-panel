import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CircleArrowLeftIcon, CircleArrowRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListContext, useTranslate } from "react-admin";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    pagination?: boolean;
}

export function DataTable<TData, TValue>({ columns, pagination = true }: DataTableProps<TData, TValue>) {
    const { page, setPage, perPage, setPerPage, total, data } = useListContext();
    const translate = useTranslate();

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
        <div>
            <Table className="bg-neutral-0">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, i) => (
                        <TableRow key={i} className="bg-green-50 hover:bg-green-50 ">
                            {headerGroup.headers.map((header, j) => {
                                return (
                                    <TableHead key={j} className="text-neutral-100 text-base border border-muted ">
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
                            <TableRow key={i} data-state={row.getIsSelected() && "selected"} className="border-muted">
                                {row.getVisibleCells().map((cell, j) => (
                                    <TableCell key={j} className="text-sm border border-muted ">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-sm border border-muted ">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {pagination && (
                <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
                    <div className="flex items-center space-x-2">
                        <Button
                            aria-label="Go to previous page"
                            variant="clearBtn"
                            size="icon"
                            className="text-green-50 hover:text-green-30 disabled:text-neutral-30 size-5"
                            onClick={() => {
                                table.previousPage();
                                setPage(page - 1);
                            }}
                            disabled={!table.getCanPreviousPage()}>
                            <CircleArrowLeftIcon className="size-4" aria-hidden="true" />
                        </Button>

                        {table.getState().pagination.pageIndex > 1 && (
                            <Button
                                size={"sm"}
                                variant="clearBtn"
                                onClick={() => {
                                    table.firstPage();
                                    setPage(1);
                                }}
                                className="m-0 p-0 text-sm font-medium hover:text-green-50 cursor-pointer">
                                1
                            </Button>
                        )}

                        {table.getState().pagination.pageIndex > 2 && <div className="text-sm font-medium">...</div>}

                        {table.getState().pagination.pageIndex > 0 && (
                            <Button
                                size={"sm"}
                                variant="clearBtn"
                                onClick={() => {
                                    table.previousPage();
                                    setPage(page - 1);
                                }}
                                className="m-0 p-0 text-sm font-medium hover:text-green-50 cursor-pointer">
                                {table.getState().pagination.pageIndex}
                            </Button>
                        )}

                        <Button
                            size={"sm"}
                            variant="clearBtn"
                            className="text-sm font-medium text-green-50 hover:text-green-50 m-0 p-0">
                            {table.getState().pagination.pageIndex + 1}
                        </Button>

                        {table.getPageCount() > table.getState().pagination.pageIndex + 2 && (
                            <Button
                                variant="clearBtn"
                                size={"sm"}
                                onClick={() => {
                                    table.nextPage();
                                    setPage(page + 1);
                                }}
                                className="m-0 p-0 text-sm font-medium hover:text-green-50 cursor-pointer">
                                {table.getState().pagination.pageIndex + 2}
                            </Button>
                        )}

                        {table.getPageCount() > 3 &&
                            table.getState().pagination.pageIndex + 3 < table.getPageCount() && (
                                <div className="text-sm font-medium">...</div>
                            )}

                        {table.getPageCount() > table.getState().pagination.pageIndex + 1 && (
                            <Button
                                size={"sm"}
                                variant="clearBtn"
                                onClick={() => {
                                    table.lastPage();
                                    setPage(table.getPageCount());
                                }}
                                className="m-0 p-0 text-sm font-medium hover:text-green-50 cursor-pointer">
                                {table.getPageCount()}
                            </Button>
                        )}

                        <Button
                            aria-label="Go to next page"
                            variant="clearBtn"
                            size="icon"
                            className="text-green-50 hover:text-green-30 disabled:text-neutral-30 size-5"
                            onClick={() => {
                                table.nextPage();
                                setPage(page + 1);
                            }}
                            disabled={!table.getCanNextPage()}>
                            <CircleArrowRightIcon className="size-4" aria-hidden="true" />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <p className="whitespace-nowrap text-sm font-medium">
                            {translate("resources.transactions.pagination")}
                        </p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={value => {
                                table.setPageSize(Number(value));
                                setPerPage(Number(value));
                            }}>
                            <SelectTrigger className="h-8 border-none bg-green-60 p-1 w-auto gap-0.5">
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
                </div>
            )}
        </div>
    );
}
