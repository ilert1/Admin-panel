import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CircleArrowLeftIcon, CircleArrowRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListContext, useTranslate } from "react-admin";
import { useCallback, useEffect } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data?: TData[];
    pagination?: boolean;
    total?: number;
    page?: number;
    perPage?: number;
    setPage?: (count: number) => void;
    setPerPage?: (count: number) => void;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
    const {
        columns,
        pagination = true,
        data: propData = [],
        total: propTotal = 0,
        page: propPage = 1,
        perPage: propPerPage = 10,
        setPage: propSetPage = () => {},
        setPerPage: propSetPerPage = () => {}
    } = props;

    const context = useListContext();
    const isUsingContext = !props.total;

    const data = isUsingContext ? context.data : propData;
    const total = isUsingContext ? context.total : propTotal;
    const page = isUsingContext ? context.page : propPage;
    const perPage = isUsingContext ? context.perPage : propPerPage;
    const setPage = isUsingContext ? context.setPage : propSetPage;
    const setPerPage = isUsingContext ? context.setPerPage : propSetPerPage;

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

    const renderPagination = useCallback(() => {
        const totalPages = table.getPageCount();
        const currentPage = table.getState().pagination.pageIndex + 1;
        const pages = [];

        if (totalPages > 6) {
            if (currentPage <= 2) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 1) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }

        return (
            <div className="flex items-center space-x-2">
                <Button
                    aria-label="Go to previous page"
                    variant="text_btn"
                    size="icon"
                    onClick={() => setPage(currentPage - 1)}
                    className="size-5"
                    disabled={currentPage === 1}>
                    <CircleArrowLeftIcon className="size-4" aria-hidden="true" />
                </Button>

                {pages.map((page, index) =>
                    typeof page === "number" ? (
                        <Button
                            key={index}
                            size="sm"
                            variant="text_btn"
                            onClick={() => setPage(page)}
                            className={`m-0 p-0 text-sm font-normal cursor-pointer ${
                                page === currentPage ? "text-green-50" : "text-neutral-90 dark:text-neutral-0"
                            }`}>
                            {page}
                        </Button>
                    ) : (
                        <div key={index} className="text-sm font-normal">
                            {page}
                        </div>
                    )
                )}

                <Button
                    aria-label="Go to next page"
                    variant="text_btn"
                    size="icon"
                    onClick={() => setPage(currentPage + 1)}
                    className="size-5"
                    disabled={currentPage === totalPages}>
                    <CircleArrowRightIcon className="size-4" aria-hidden="true" />
                </Button>
            </div>
        );
    }, [setPage, table]);

    return (
        <>
            <Table className="bg-neutral-0">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, i) => (
                        <TableRow key={i} className="bg-green-50 hover:bg-green-50">
                            {headerGroup.headers.map((header, j) => {
                                return (
                                    <TableHead
                                        key={j}
                                        className="text-white text-base border border-neutral-40 dark:border-muted px-4 py-[9px] leading-4 text-left">
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
                    {data && table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, i) => (
                            <TableRow key={i} data-state={row.getIsSelected() && "selected"} className="border-muted ">
                                {row.getVisibleCells().map((cell, j) => (
                                    <TableCell
                                        key={j}
                                        className="text-sm border border-neutral-40 dark:border-muted text-neutral-90 dark:text-neutral-0 py-2 bg-neutral-0 dark:bg-neutral-100">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-sm border border-muted text-neutral-90 dark:text-neutral-30 bg-white dark:bg-black">
                                {translate("resources.transactions.undefined")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div
                className={`flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8 ${
                    pagination && total > perPage ? "" : "!justify-end"
                }`}>
                {pagination && total > perPage && renderPagination()}

                <div className="flex items-center space-x-2">
                    <p className="whitespace-nowrap text-sm font-normal text-neutral-90 dark:text-neutral-0">
                        {translate("resources.transactions.pagination")}
                    </p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={value => {
                            table.setPageSize(Number(value));
                            setPerPage(Number(value));
                        }}>
                        <SelectTrigger className="h-8 border-none bg-white dark:bg-green-60 p-1 w-auto gap-0.5 text-neutral-90 dark:text-white">
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
        </>
    );
}
