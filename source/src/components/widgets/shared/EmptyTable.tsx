import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "react-admin";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function EmptyTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
    const translate = useTranslate();
    const table = useReactTable({
        data: [],
        columns,
        manualPagination: true,
        rowCount: 0,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 1,
                pageSize: 1
            }
        }
    });

    return (
        <>
            <Table className="min-h-20">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, i) => (
                        <TableRow key={i} className="relative bg-green-50 hover:bg-green-50">
                            {headerGroup.headers.map((header, j) => {
                                return (
                                    <TableHead
                                        key={j}
                                        className="border border-neutral-40 px-4 py-[9px] text-left text-base leading-4 text-white dark:border-muted">
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
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 border border-muted bg-white text-center text-sm text-neutral-90 dark:bg-black dark:text-neutral-30">
                            {translate("resources.transactions.undefined")}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div className="mb-2 flex min-h-[1.5rem] w-full items-center justify-end gap-4 overflow-x-auto overflow-y-hidden p-1 sm:flex-row sm:gap-8">
                <div className="flex items-center space-x-2">
                    <p className="hidden whitespace-nowrap text-sm font-normal text-neutral-90 dark:text-neutral-0 sm:block">
                        {translate("resources.transactions.pagination")}
                    </p>
                    <Select>
                        <SelectTrigger className="h-8 w-auto gap-0.5 border-none bg-white p-1 text-neutral-90 dark:bg-green-60 dark:text-white">
                            <SelectValue placeholder={0} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
}
