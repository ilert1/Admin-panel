import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CircleArrowLeftIcon, CircleArrowRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListContext, useTranslate } from "react-admin";
import { useEffect } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
    total?: number;
    page?: number;
    perPage?: number;
    setPage?: (count: number) => void;
    setPerPage?: (count: number) => void;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
    const { columns, pagination = true } = props;
    let data, total, page, perPage, setPage, setPerPage;
    if (props.total) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ({ data, total, page = 1, perPage = 10, setPage = () => {}, setPerPage = () => {} } = props);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ({ data, total, page, perPage, setPage, setPerPage } = useListContext());
    }

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

    useEffect(() => {
        table.setPageIndex(page - 1);
    }, [page, table]);

    return (
        <div>
            <Table className="bg-neutral-0">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, i) => (
                        <TableRow key={i} className="bg-green-50 hover:bg-green-50">
                            {headerGroup.headers.map((header, j) => {
                                return (
                                    <TableHead
                                        key={j}
                                        className="text-white text-base border border-muted px-4 py-[9px] leading-4 text-center">
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
                            <TableRow key={i} data-state={row.getIsSelected() && "selected"} className="border-muted ">
                                {row.getVisibleCells().map((cell, j) => (
                                    <TableCell key={j} className="text-sm border border-muted text-neutral-100 py-2">
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
            {pagination && total > perPage && (
                <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
                    <div className="flex items-center space-x-2">
                        <Button
                            aria-label="Go to previous page"
                            variant="clearBtn"
                            size="icon"
                            className="text-green-50 hover:text-green-30 disabled:text-neutral-30 size-5"
                            onClick={() => {
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
