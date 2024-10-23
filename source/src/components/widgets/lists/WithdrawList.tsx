import {
    useTranslate,
    useListController,
    ListContextProvider,
    RecordContextProvider,
    usePermissions
} from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { WithdrawShow } from "@/components/widgets/show";
import { EyeIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import useWithdrawFilter from "@/hooks/useWithdrawFilter";
import { CryptoTransfer } from "../components/CryptoTransfer";

const WithdrawFilterSidebar = () => {
    const {
        translate,
        operationId,
        onOperationIdChanged,
        startDate,
        endDate,
        changeDate,
        handleDownloadReport,
        clearFilters
    } = useWithdrawFilter();

    return (
        <div className="w-full mb-6 flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start md:max-w-96">
                <span className="md:text-nowrap">{translate("resources.withdraw.filter.filterById")}</span>
                <Input
                    className="flex-1 text-sm placeholder:text-neutral-70"
                    placeholder={translate("resources.withdraw.filter.filterByIdPlaceholder")}
                    value={operationId}
                    onChange={onOperationIdChanged}
                />
            </label>

            <DateRangePicker
                title={translate("resources.withdraw.filter.filterByDate")}
                placeholder={translate("resources.withdraw.filter.filterByDatePlaceholder")}
                dateRange={{ from: startDate, to: endDate }}
                onChange={changeDate}
            />

            <Button
                className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                onClick={clearFilters}
                variant="clearBtn"
                size="default"
                disabled={!operationId && !startDate}>
                <span>{translate("resources.withdraw.filter.clearFilters")}</span>
                <XIcon className="size-4" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="md:ml-auto" variant="default" size="sm">
                        {translate("resources.withdraw.download.downloadReportButtonText")}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 border-green-50" align="end">
                    <DropdownMenuItem
                        className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-20 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                        onClick={() => handleDownloadReport("excel")}>
                        Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-4 py-1.5 text-sm text-neutral-80 dark:text-neutral-20 focus:bg-green-50 focus:text-white focus:dark:text-white rounded-none cursor-pointer"
                        onClick={() => handleDownloadReport("pdf")}>
                        PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();
    const navigate = useNavigate();
    const { permissions } = usePermissions();
    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);

    const [showOpen, setShowOpen] = useState(false);
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.withdraw.fields.created_at"),
            cell: ({ row }) => (
                <>
                    <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
                    <p>{new Date(row.original.created_at).toLocaleTimeString()}</p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.withdraw.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />
        },
        {
            accessorKey: "destination.id",
            header: translate("resources.withdraw.fields.destination.id"),
            cell: ({ row }) => <TextField text={row.original.destination.id} copyValue />
        },
        {
            accessorKey: "destination.amount.value",
            header: translate("resources.withdraw.fields.destination.amount.value"),
            cell: ({ row }) => {
                const value =
                    (row.original.destination.amount.value.quantity || 0) /
                    row.original.destination.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.destination.amount.value.accuracy))} ${
                    row.original.destination.amount.currency || ""
                }`;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <RecordContextProvider value={row.original}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="clearBtn" className="w-full p-0">
                                    <span className="sr-only">Open menu</span>
                                    <EyeIcon className="text-green-50 size-7" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                    {translate("app.ui.actions.quick_show")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/withdraw/${row.original.id}/show`)}>
                                    {translate("app.ui.actions.show")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RecordContextProvider>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div className="flex flex-col">
                        <div className="max-w-[1060px]">
                            <WithdrawFilterSidebar />
                        </div>
                        <div className="flex gap-6 flex-wrap-reverse items-end">
                            <div className="grow-[1]">
                                <h3 className="mb-4 text-xl text-neutral-100">
                                    {translate("resources.withdraw.tableTitle")}
                                </h3>
                                <DataTable columns={columns} data={[]} />
                            </div>

                            {merchantOnly && (
                                <div className="w-[476px] max-w-[476px] h-fit">
                                    <CryptoTransfer />
                                </div>
                            )}
                        </div>
                    </div>
                </ListContextProvider>

                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full [&>div>div]:!block">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.transactions.showHeader")}</SheetTitle>
                                <SheetDescription>
                                    {translate("resources.transactions.showDescription", { id: showTransactionId })}
                                </SheetDescription>
                            </SheetHeader>
                            <WithdrawShow id={showTransactionId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
