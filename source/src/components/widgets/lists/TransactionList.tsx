import {
    useDataProvider,
    useTranslate,
    useListController,
    RecordContextProvider,
    useGetList,
    ListContextProvider,
    useListContext,
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
import { useState, useMemo, useEffect, ChangeEvent, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionShow } from "@/components/widgets/show";
import { useMediaQuery } from "react-responsive";
import { useTransactionActions } from "@/hooks";
import { TransactionStorno } from "@/components/widgets/forms";
import { API_URL } from "@/data/base";
import { EventBus, EVENT_STORNO } from "@/helpers/event-bus";
import { TextField } from "@/components/ui/text-field";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import useReportDownload from "@/hooks/useReportDownload";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";

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

const TransactionFilterSidebar = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const { filterValues, setFilters, displayedFilters } = useListContext();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const { setPage } = useListContext();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    // TODO: временное решение, нужно расширить компонент селекта для поддержки пагинациц
    const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });
    const { startDate, endDate, handleSelectedIdChange, setStartDate, setEndDate, /* reqId, */ handleDownload } =
        useReportDownload();

    const [id, setId] = useState(filterValues?.id || "");
    const [customerPaymentId, setCustomerPaymentId] = useState(filterValues?.customer_payment_id || "");
    const [account, setAccount] = useState(filterValues?.account || "");
    const [typeTabActive, setTypeTabActive] = useState("");

    const chooseClassTabActive = useCallback(
        (type: string) => {
            return typeTabActive === type
                ? "text-green-50 dark:text-green-40 border-b-2 dark:border-green-40 border-green-50 pb-1 duration-200"
                : "pb-1 border-b-2 border-transparent duration-200 hover:text-green-40";
        },
        [typeTabActive]
    );

    const onPropertySelected = debounce(
        (value: Account | string, type: "id" | "customer_payment_id" | "account" | "type") => {
            if (value) {
                if (type === "account") {
                    value = (value as Account).id;
                }
                setFilters({ ...filterValues, [type]: value }, displayedFilters);
            } else {
                Reflect.deleteProperty(filterValues, type);
                setFilters(filterValues, displayedFilters);
            }
            setPage(1);
        },
        300
    );

    const onIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        onPropertySelected(e.target.value, "id");
    };

    const onCustomerPaymentIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomerPaymentId(e.target.value);
        onPropertySelected(e.target.value, "customer_payment_id");
    };

    const onAccountChanged = (account: Account | string) => {
        setAccount(account);
        onPropertySelected(account, "account");
    };

    const changeDate = (date: DateRange | undefined) => {
        if (date) {
            if (date.from) {
                setStartDate(date.from);
            }

            if (date.to) {
                setEndDate(date.to);
            }
        } else {
            setStartDate(undefined);
            setEndDate(undefined);
        }
    };

    const clearFilters = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setId("");
        setAccount("");
        setCustomerPaymentId("");
        setTypeTabActive("");
        setFilters({}, displayedFilters);
        setPage(1);
    };

    return (
        <>
            <div className="flex flex-col items-stretch sm:flex-row sm:items-center gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap mb-6">
                <label className="flex flex-1 gap-2 items-center lg:min-w-96">
                    <span className="md:text-nowrap">{translate("resources.transactions.filter.filterById")}</span>
                    <Input
                        className="flex-1 text-sm placeholder:text-neutral-70"
                        placeholder={translate("resources.transactions.fields.id")}
                        value={id}
                        onChange={onIdChanged}
                    />
                </label>
                <label className="flex gap-2 items-center lg:min-w-96">
                    <span className="md:text-nowrap">
                        {translate("resources.transactions.filter.filterCustomerPaymentId")}
                    </span>
                    <Input
                        className="flex-1 text-sm placeholder:text-neutral-70"
                        placeholder={translate("resources.transactions.fields.id")}
                        value={customerPaymentId}
                        onChange={onCustomerPaymentIdChanged}
                    />
                </label>
                {adminOnly && (
                    <div className="min-w-48 max-w-80 flex-1">
                        <Select onValueChange={onAccountChanged} value={account}>
                            <SelectTrigger>
                                <SelectValue placeholder={translate("resources.transactions.filter.filterByAccount")} />
                            </SelectTrigger>
                            <SelectContent>
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

                <DateRangePicker
                    placeholder={translate("resources.transactions.filter.filterByDate")}
                    dateRange={{ from: startDate, to: endDate }}
                    onChange={changeDate}
                />

                {adminOnly && (
                    <div className="min-w-48 max-w-80 flex-1">
                        <Select onValueChange={handleSelectedIdChange}>
                            <SelectTrigger>
                                <SelectValue placeholder={translate("resources.transactions.download.accountField")} />
                            </SelectTrigger>

                            <SelectContent>
                                {accounts?.map(el => {
                                    return (
                                        <SelectItem key={el.id} value={el.id.toString()}>
                                            {el.meta.caption}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Button
                    className="ml-0 sm:ml-auto flex items-center gap-1 w-auto h-auto px-0"
                    onClick={clearFilters}
                    variant="clearBtn"
                    size="default"
                    disabled={!id && !account && !customerPaymentId && !startDate}>
                    <span>{translate("resources.transactions.filter.clearFilters")}</span>
                    <XIcon className="size-4" />
                </Button>

                <Button
                    onClick={handleDownload}
                    variant="default"
                    size="sm"
                    // disabled={reqId ? false : true}
                >
                    {translate("resources.transactions.download.downloadReportButtonText")}
                </Button>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button className={chooseClassTabActive("")} onClick={clearFilters} disabled={typeTabActive === ""}>
                        All operations
                    </button>
                    {Object.keys(data?.transactionTypes).map(item => (
                        <button
                            key={data?.transactionTypes?.[item].type}
                            className={chooseClassTabActive(data?.transactionTypes?.[item].type_descr)}
                            disabled={typeTabActive === data?.transactionTypes?.[item].type_descr}
                            onClick={() => {
                                setTypeTabActive(data?.transactionTypes?.[item].type_descr);
                                onPropertySelected(data?.transactionTypes?.[item].type, "type");
                            }}>
                            {data?.transactionTypes?.[item].type_descr}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    <p className="text-sm text-neutral-50 cursor-pointer hover:text-green-50">
                        {translate("resources.transactions.chart")}
                    </p>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                            stroke="#237648"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 12V3"
                            stroke="#237648"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M19.7906 7.5L4.20935 16.5"
                            stroke="#237648"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </>
    );
};

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
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

    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();
    const navigate = useNavigate();

    const [showOpen, setShowOpen] = useState(false);
    const [showTransactionId, setShowTransactionId] = useState<string>("");

    const openSheet = (id: string) => {
        setShowTransactionId(id);
        setShowOpen(true);
    };

    const [stornoOpen, setStornoOpen] = useState(false);

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

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
            cell: ({ row }) => <TextField text={row.original.meta.customer_id} />
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
        // {
        //     accessorKey: "state.final",
        //     header: translate("resources.transactions.fields.state.final")
        // },
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
    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <div className="mb-6 mt-5">
                        <h1 className="text-3xl mb-6">{translate("app.menu.transactions")}</h1>

                        <TransactionFilterSidebar />
                    </div>

                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        {/* Header - фиксированная часть */}
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
