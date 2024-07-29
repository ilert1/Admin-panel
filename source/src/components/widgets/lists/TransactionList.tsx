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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionShow } from "@/components/widgets/show";
import { useMediaQuery } from "react-responsive";
import { useTransactionActions } from "@/hooks";
import { TransactionStorno } from "@/components/widgets/forms";
import { API_URL } from "@/data/base";
import { EventBus, EVENT_STORNO } from "@/helpers/event-bus";
import { TextField } from "@/components/ui/text-field";
import { DatePicker } from "@/components/ui/date-picker";
import useReportDownload from "@/hooks/useReportDownload";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

const TransactionFilterSidebar = () => {
    const { filterValues, setFilters, displayedFilters } = useListContext();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    // TODO: временное решение, нужно расширить компонент селекта для поддержки пагинациц
    const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });

    const [id, setId] = useState(filterValues?.id || "");
    const [account, setAccount] = useState(filterValues?.account || "");

    const onPropertySelected = debounce((value: Account | string, type: "id" | "account") => {
        if (value) {
            if (type === "account") {
                value = (value as Account).id;
            }
            setFilters({ ...filterValues, [type]: value }, displayedFilters);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
    }, 300);

    const onIdChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        onPropertySelected(e.target.value, "id");
    };

    const onAccountChanged = (account: Account | string) => {
        setAccount(account);
        onPropertySelected(account, "account");
    };

    const clearFilters = () => {
        setId("");
        setAccount("");
        setFilters({}, displayedFilters);
    };

    return (
        <div className="sm:w-full flex flex-col sm:flex-row gap-4">
            <Input
                placeholder={translate("resources.transactions.filter.filterById")}
                value={id}
                onChange={onIdChanged}
            />
            {adminOnly && (
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
            )}
            <Button onClick={clearFilters} variant="secondary" size="sm" disabled={!id && !account}>
                {translate("resources.transactions.filter.clearFilters")}
            </Button>
        </div>
    );
};

export const TransactionList = () => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    // TODO: временное решение, нужно расширить компонент селекта для поддержки пагинациц
    const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const { startDate, endDate, handleSelectedIdChange, setStartDate, setEndDate, handleDownload } =
        useReportDownload();

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
            accessorKey: "id",
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />,
            filterFn: "includesString"
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
            accessorKey: "state.final",
            header: translate("resources.transactions.fields.state.final")
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
            accessorKey: "type",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => {
                const rateInfo: Transaction.RateInfo = row.original.rate_info;
                if (rateInfo) {
                    return `${rateInfo.s_currency} / ${rateInfo.d_currency}: ${(
                        (rateInfo.value.quantity || 0) / rateInfo.value.accuracy
                    ).toFixed(Math.log10(rateInfo.value.accuracy))}`;
                } else {
                    return 0;
                }
            }
        },
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt")
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <RecordContextProvider value={row.original}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
                                    {translate("ra.action.show")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
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
                    <div className="mb-10 mt-5">
                        <TransactionFilterSidebar />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                            <DatePicker
                                placeholder={translate("resources.transactions.download.startDate")}
                                date={startDate}
                                onChange={setStartDate}
                            />
                            <DatePicker
                                placeholder={translate("resources.transactions.download.endDate")}
                                date={endDate}
                                onChange={setEndDate}
                            />
                            {adminOnly && (
                                <Select onValueChange={handleSelectedIdChange}>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate("resources.transactions.download.accountField")}
                                        />
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
                            )}
                            <Button onClick={handleDownload} variant="default" size="sm">
                                {translate("resources.transactions.download.downloadReportButtonText")}
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={columns} />
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
                            <TransactionShow id={showTransactionId} />
                        </ScrollArea>
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
