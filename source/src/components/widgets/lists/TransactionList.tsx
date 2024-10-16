import {
    useTranslate,
    useListController,
    RecordContextProvider,
    useGetList,
    ListContextProvider,
    usePermissions
} from "react-admin";
import { useQuery } from "react-query";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EyeIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionShow } from "@/components/widgets/show";
import { useMediaQuery } from "react-responsive";
import { useTransactionActions } from "@/hooks";
import { TransactionStorno } from "@/components/widgets/forms";
import { API_URL } from "@/data/base";
import { EventBus, EVENT_STORNO } from "@/helpers/event-bus";
import { TextField } from "@/components/ui/text-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useTransactionFilter from "@/hooks/useTransactionFilter";
import { DateRange } from "react-day-picker";
import fetchDictionaries from "@/helpers/get-dictionaries";
import BarChart from "@/components/ui/Bar";
import { debounce } from "lodash";

const TransactionActions = (props: { dictionaries: any; stornoOpen: () => void; stornoClose: () => void }) => {
    const {
        switchDispute,
        showDispute,
        disputeCaption,
        showState,
        switchState,
        stateCaption,
        states,
        showCommit,
        commitCaption,
        commitTransaction,
        showStorno,
        stornoCaption,
        makeStorno
    } = useTransactionActions(props.dictionaries);

    useEffect(() => {
        EventBus.getInstance().registerUnique(
            EVENT_STORNO,
            (data: {
                sourceValue: string;
                destValue: string;
                source: string;
                currency: string;
                destination: string;
            }) => {
                makeStorno(data);
                props?.stornoClose?.();
            }
        );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {showDispute && <DropdownMenuItem onClick={switchDispute}>{disputeCaption}</DropdownMenuItem>}
            {showState && (
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{stateCaption}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {states.map((state, i) => (
                                <DropdownMenuItem key={i} onClick={() => switchState(state.state_int)}>
                                    {state.state_description}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            )}
            {showCommit && <DropdownMenuItem onClick={commitTransaction}>{commitCaption}</DropdownMenuItem>}
            {showStorno && <DropdownMenuItem onClick={() => props?.stornoOpen?.()}>{stornoCaption}</DropdownMenuItem>}
        </>
    );
};

const TransactionFilterSidebar = ({
    typeTabActive,
    setTypeTabActive,
    setChartOpen,
    chartOpen
}: {
    typeTabActive: string;
    chartOpen: boolean;
    setTypeTabActive: (type: string) => void;
    setChartOpen: (state: boolean) => void;
}) => {
    const {
        translate,
        data,
        adminOnly,
        accounts,
        operationId,
        onOperationIdChanged,
        customerPaymentId,
        onCustomerPaymentIdChanged,
        orderStatusFilter,
        onOrderStatusChanged,
        account,
        onAccountChanged,
        startDate,
        endDate,
        changeDate,
        // typeTabActive,
        onTabChanged,
        chooseClassTabActive,
        handleDownloadReport,
        clearFilters
    } = useTransactionFilter(typeTabActive, setTypeTabActive);
    const debounced = debounce(setChartOpen, 200);

    return (
        <div className="mb-6">
            <div className="w-full mb-6">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
                    <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <span className="md:text-nowrap">{translate("resources.transactions.filter.filterById")}</span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={operationId}
                            onChange={onOperationIdChanged}
                        />
                    </label>

                    <label className="flex flex-1 md:flex-col gap-2 items-center md:items-start">
                        <span className="md:text-nowrap">
                            {translate("resources.transactions.filter.filterCustomerPaymentId")}
                        </span>
                        <Input
                            className="flex-1 text-sm placeholder:text-neutral-70"
                            placeholder={translate("resources.transactions.filter.filterByIdPlaceholder")}
                            value={customerPaymentId}
                            onChange={onCustomerPaymentIdChanged}
                        />
                    </label>

                    <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-36">
                        <span className="md:text-nowrap">
                            {translate("resources.transactions.filter.filterByOrderStatus")}
                        </span>
                        <Select
                            onValueChange={val =>
                                val !== "null" ? onOrderStatusChanged(val) : onOrderStatusChanged("")
                            }
                            value={orderStatusFilter}>
                            <SelectTrigger className="text-ellipsis">
                                <SelectValue
                                    placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">
                                    {translate("resources.transactions.filter.showAll")}
                                </SelectItem>
                                {data &&
                                    Object.keys(data.states).map(index => (
                                        <SelectItem key={data.states[index].state_int} value={data.states[index]}>
                                            {data.states[index].state_description}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DateRangePicker
                        placeholder={translate("resources.transactions.filter.filterByDate")}
                        dateRange={{ from: startDate, to: endDate }}
                        onChange={changeDate}
                    />

                    {adminOnly && (
                        <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-40">
                            <span className="md:text-nowrap">
                                {translate("resources.transactions.filter.filterByAccount")}
                            </span>
                            <Select
                                onValueChange={val => (val !== "null" ? onAccountChanged(val) : onAccountChanged(""))}
                                value={account}>
                                <SelectTrigger className="text-ellipsis">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.filter.filterAllPlaceholder")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">
                                        {translate("resources.transactions.filter.showAll")}
                                    </SelectItem>
                                    {accounts &&
                                        accounts.map(account => (
                                            <SelectItem key={account.id} value={account}>
                                                {account.meta.caption}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button
                        className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                        onClick={clearFilters}
                        variant="clearBtn"
                        size="default"
                        disabled={
                            !operationId &&
                            !account &&
                            !customerPaymentId &&
                            !startDate &&
                            !account.id &&
                            !typeTabActive &&
                            !orderStatusFilter
                        }>
                        <span>{translate("resources.transactions.filter.clearFilters")}</span>
                        <XIcon className="size-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="md:ml-auto" variant="default" size="sm">
                                {translate("resources.transactions.download.downloadReportButtonText")}
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
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <button className={chooseClassTabActive("")} onClick={clearFilters} disabled={typeTabActive === ""}>
                        All operations
                    </button>
                    {Object.keys(data?.transactionTypes).map(item => (
                        <button
                            key={data?.transactionTypes?.[item].type}
                            className={chooseClassTabActive(data?.transactionTypes?.[item].type_descr)}
                            disabled={typeTabActive === data?.transactionTypes?.[item].type_descr}
                            onClick={() => onTabChanged(data?.transactionTypes?.[item])}>
                            {data?.transactionTypes?.[item].type_descr}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <Button onClick={() => debounced(prev => !prev)} variant={"clearBtn"} className="flex gap-1">
                        {translate("resources.transactions.chart")}
                        <img
                            src="/Chart-Icon.svg"
                            alt=""
                            className={`${chartOpen ? "bg-green-50 rounded-[4px] transition-all duration-300" : ""}`}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const TransactionList = () => {
    const data = fetchDictionaries();
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();
    const navigate = useNavigate();

    // TODO: временное решение, нужно расширить компонент селекта для поддержки пагинациц
    const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const { data: currencies } = useQuery("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );
    const sortedCurrencies = useMemo(() => {
        return currencies?.data?.sort((a: any, b: any) => a.prior_gr - b.prior_gr) || [];
    }, [currencies]);
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    const [typeTabActive, setTypeTabActive] = useState("");
    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");
    const [stornoOpen, setStornoOpen] = useState(false);
    const [chartOpen, setChartOpen] = useState(false);

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt"),
            cell: ({ row }) => (
                <>
                    <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
                    <p>{new Date(row.original.created_at).toLocaleTimeString()}</p>
                </>
            )
        },
        {
            accessorKey: "id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} wrap copyValue />,
            filterFn: "includesString"
        },
        {
            accessorKey: "meta.customer_id",
            header: translate("resources.transactions.fields.meta.customer_id"),
            cell: ({ row }) => {
                //console.log(row.original);
                return (
                    <TextField
                        text={
                            row.original.meta?.customer_id
                                ? row.original.meta.customer_id
                                : row.original.payload?.customer_data?.customer_id
                        }
                    />
                );
            }
        },
        {
            accessorKey: "meta.customer_payment_id",
            header: translate("resources.transactions.fields.meta.customer_payment_id"),
            cell: ({ row }) => <TextField text={row.original.meta.customer_payment_id} wrap copyValue />
        },
        {
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => data?.transactionTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            accessorKey: "state.state_description",
            header: translate("resources.transactions.fields.state.title")
        },
        {
            accessorKey: "sourceValue",
            header: translate("resources.transactions.fields.sourceValue"),
            cell: ({ row }) => {
                const value =
                    (row.original.source.amount.value.quantity || 0) / row.original.source.amount.value.accuracy;
                if (isNaN(value)) return "-";
                return `${value.toFixed(Math.log10(row.original.source.amount.value.accuracy))} ${
                    row.original.source.amount.currency || ""
                }`;
            }
        },
        {
            accessorKey: "destValue",
            header: translate("resources.transactions.fields.destValue"),
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
            accessorKey: "rate_info",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => {
                const rateInfo: Transaction.RateInfo = row.original.rate_info;
                if (rateInfo) {
                    return (
                        <>
                            <p className="text-neutral-60 dark:text-neutral-70">{`${rateInfo.s_currency} / ${rateInfo.d_currency}:`}</p>
                            <p>
                                {((rateInfo.value.quantity || 0) / rateInfo.value.accuracy).toFixed(
                                    Math.log10(rateInfo.value.accuracy)
                                )}
                            </p>
                        </>
                    );
                } else {
                    return 0;
                }
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
                                <DropdownMenuItem onClick={() => openSheet(row.original.id)} className="border-none">
                                    {translate("app.ui.actions.quick_show")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigate(`/transactions/${row.original.id}/show`)}
                                    className="border-none">
                                    {translate("app.ui.actions.show")}
                                </DropdownMenuItem>
                                {adminOnly && <DropdownMenuSeparator />}
                                <TransactionActions
                                    dictionaries={data}
                                    stornoOpen={() => setStornoOpen(true)}
                                    stornoClose={() => setStornoOpen(false)}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RecordContextProvider>
                );
            }
        }
    ];

    //TODO delete chart mock and the dates
    const startDate = new Date("2023-07-01");
    const endDate = new Date("2023-09-15");

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div className="mb-6 mt-5">
                        <TransactionFilterSidebar
                            typeTabActive={typeTabActive}
                            setTypeTabActive={setTypeTabActive}
                            setChartOpen={setChartOpen}
                            chartOpen={chartOpen}
                        />
                    </div>
                    <div className="w-full mb-6 overflow-y-hidden">
                        <BarChart
                            startDate={startDate}
                            endDate={endDate}
                            typeTabActive={typeTabActive}
                            open={chartOpen}
                        />
                    </div>

                    <DataTable data={data} columns={columns} />
                </ListContextProvider>
                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <SheetHeader className="p-[42px] pb-[24px] flex-shrink-0">
                            <div>
                                <div className="flex justify-between items-center pb-2">
                                    <SheetTitle className="text-display-1">
                                        {translate("app.ui.transactionHistory")}
                                    </SheetTitle>
                                    <button
                                        onClick={() => setShowOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                        <XIcon className="h-[28px] w-[28px]" />
                                    </button>
                                </div>
                                <TextField text={showTransactionId} copyValue />
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-auto" tabIndex={-1}>
                            <SheetDescription></SheetDescription>
                            <TransactionShow id={showTransactionId} type="compact" />
                        </div>
                    </SheetContent>
                </Sheet>
                <Sheet open={stornoOpen} onOpenChange={setStornoOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full [&>div>div]:!block">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.transactions.show.storno")}</SheetTitle>
                            </SheetHeader>
                            <TransactionStorno accounts={accounts || []} currencies={sortedCurrencies || []} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
