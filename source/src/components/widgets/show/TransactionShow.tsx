import {
    useShowController,
    useTranslate,
    useGetManyReference,
    usePermissions,
    useLocaleState,
    useDataProvider
} from "react-admin";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { BooleanField } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";
import { useEffect, useMemo, useState } from "react";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { TableTypes } from "../shared/SimpleTable";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";
import { useTransactionActions } from "@/hooks";

export const TransactionShow = (props: { id: string; type?: "compact" }) => {
    const data = fetchDictionaries();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const { permissions, isLoading } = usePermissions();
    const context = useShowController<Transaction.Transaction>({ id: props.id });
    const [newState, setNewState] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [merchantName, setMerchantName] = useState("");
    const dataProvider = useDataProvider();

    // const [stornoOpen, setStornoOpen] = useState(false);
    // const { data: accounts } = useGetList("accounts", { pagination: { perPage: 100, page: 1 } });
    // const { data: currencies } = useQuery("currencies", () =>
    //     fetch(`${API_URL}/dictionaries/curr`, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("access-token")}`
    //         }
    //     }).then(response => response.json())
    // );
    // const sortedCurrencies = useMemo(() => {
    //     return (
    //         currencies?.data?.sort((a: Currencies.Currency, b: Currencies.Currency) => a.prior_gr - b.prior_gr) || []
    //     );
    // }, [currencies]);

    const {
        switchDispute,
        showDispute,
        disputeCaption,
        showState,
        switchState,
        states,
        showCommit,
        commitCaption,
        commitTransaction
    } = useTransactionActions(data, context.record);

    // useEffect(() => {
    //     EventBus.getInstance().registerUnique(
    //         EVENT_STORNO,
    //         (data: {
    //             sourceValue: string;
    //             destValue: string;
    //             source: string;
    //             currency: string;
    //             destination: string;
    //         }) => {
    //             makeStorno(data);
    //             setStornoOpen(false);
    //         }
    //     );
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const trnId = useMemo<string>(() => context.record?.id || "", [context]);

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    useEffect(() => {
        async function fetch() {
            if (!context.record?.destination.id) {
                return;
            }
            try {
                const json = await dataProvider.getOne("merchant", {
                    id: context.record?.destination.id
                });
                setMerchantName(json.data.name);
            } catch (error) {
                // Заглушка
            }
        }
        if (!context.isLoading) {
            fetch();
        }
    }, [context.isLoading, context.record?.destination.id, dataProvider]);

    function computeValue(quantity: number, accuracy: number) {
        const value = (quantity || 0) / accuracy;
        if (isNaN(value)) return "-";
        return value.toFixed(Math.log10(accuracy));
    }

    const feesColumns: ColumnDef<Transaction.Fee>[] = [
        {
            id: "recipient",
            accessorKey: "recipient",
            header: translate("resources.transactions.fields.recipient")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${data?.feeTypes[row.original.type]?.type_descr.toLowerCase()}`
                ) || ""
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.transactions.fields.currency")
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.transactions.fields.value"),
            cell: ({ row }) => computeValue(row.original.value.quantity, row.original.value.accuracy)
        }
    ];

    const historyColumns: ColumnDef<Transaction.Transaction>[] = [
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                    </>
                );
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.transactions.fields.id")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${data?.transactionTypes[
                        row.original.type
                    ]?.type_descr.toLowerCase()}`
                ) || ""
        },
        {
            id: "state",
            accessorKey: "state.state_description",
            header: translate("resources.transactions.fields.state.title")
        },
        {
            id: "final",
            accessorKey: "state.final",
            header: translate("resources.transactions.fields.state.final")
        },
        {
            id: "committed",
            accessorKey: "committed",
            header: translate("resources.transactions.fields.committed")
        },
        {
            id: "dispute",
            accessorKey: "dispute",
            header: translate("resources.transactions.fields.dispute")
        },
        {
            id: "external_status",
            accessorKey: "meta.external_status",
            header: translate("resources.transactions.fields.meta.external_status")
        }
    ];

    const briefHistory: ColumnDef<Transaction.Transaction>[] = [
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleTimeString(locale)}</p>
                    </>
                );
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.transactions.fields.id")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) =>
                translate(
                    `resources.transactions.types.${data?.transactionTypes[
                        row.original.type
                    ]?.type_descr.toLowerCase()}`
                ) || ""
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.transactions.fields.state.title"),
            cell: ({ row }) =>
                translate(`resources.transactions.states.${row.original.state?.state_description?.toLowerCase()}`) || ""
        },
        {
            id: "source_amount",
            accessorKey: "source",
            header: translate("resources.transactions.fields.source.amount.getAmount"),
            cell: ({ row }) => {
                const val = row.original.source.amount.value.quantity / row.original.source.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row.original.source.amount.currency : "-"}</span>
                    </div>
                );
            }
        },
        {
            id: "destination_amount",
            accessorKey: "source",
            header: translate("resources.transactions.fields.destination.amount.sendAmount"),

            cell: ({ row }) => {
                const val =
                    row.original.destination.amount.value.quantity / row.original.destination.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row.original.destination.amount.currency : "-"}</span>
                    </div>
                );
            }
        }
    ];
    const isMobile = useMediaQuery({ query: `(max-width: 655px)` });

    if (context.isLoading || context.isFetching || !context.record || isLoading) {
        return <LoadingAlertDialog />;
    } else if (props.type === "compact") {
        return (
            <div className="p-[42px] pt-0 flex flex-col gap-6 top-[82px] overflow-auto">
                {permissions === "admin" && (
                    <div className={`flex justify-between ${isMobile ? "flex-col gap-4" : "flex-row"}`}>
                        {showState && (
                            <div className="flex gap-2 items-center">
                                <span>{translate("resources.transactions.fields.state.state_description")}</span>
                                <Select value={newState} onValueChange={setNewState}>
                                    <SelectTrigger className="w-[180px] border-">
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.transactions.fields.state.state_description"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent className="bg-neutral-0">
                                        {states.map(state => (
                                            <SelectItem key={state.state_int} value={state.state_int.toString()}>
                                                {translate(
                                                    `resources.transactions.states.${state?.state_description?.toLowerCase()}`
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button onClick={() => switchState(Number(newState))} disabled={!newState}>
                                    {translate("app.ui.actions.save")}
                                </Button>
                            </div>
                        )}

                        <div className="flex gap-6">
                            {showDispute && <Button onClick={switchDispute}>{disputeCaption}</Button>}

                            {showCommit && (
                                <>
                                    <Button variant={"secondary"} onClick={() => setDialogOpen(true)}>
                                        {commitCaption}
                                    </Button>

                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogContent className="rounded-16 max-h-56 xl:max-h-none h-auto max-w-[350px] overflow-hidden">
                                            <DialogHeader>
                                                <DialogTitle className="text-center">
                                                    {translate("resources.transactions.show.commitTransaction")}
                                                </DialogTitle>
                                                <DialogDescription></DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <div className="flex flex-col sm:flex-row justify-around gap-4 sm:gap-[35px] w-full">
                                                    <Button
                                                        onClick={() => {
                                                            commitTransaction();
                                                            setDialogOpen(false);
                                                        }}
                                                        className="w-full sm:w-40">
                                                        {translate("resources.transactions.show.commit")}
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setDialogOpen(false);
                                                        }}
                                                        variant="outline"
                                                        className="w-full !ml-0 px-3 sm:w-24">
                                                        {translate("app.ui.actions.cancel")}
                                                    </Button>
                                                </div>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}

                            {/* <Sheet open={stornoOpen} onOpenChange={setStornoOpen}>
                                    <SheetContent
                                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                                        side={isMobile ? "bottom" : "right"}>
                                        <ScrollArea className="h-full [&>div>div]:!block">
                                            <SheetHeader className="mb-2">
                                                <SheetTitle>{translate("resources.transactions.show.storno")}</SheetTitle>
                                            </SheetHeader>

                                            <TransactionStorno
                                                accounts={accounts || []}
                                                currencies={sortedCurrencies || []}
                                            />
                                        </ScrollArea>
                                    </SheetContent>
                                </Sheet> */}
                        </div>
                    </div>
                )}
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.type")}
                        </span>
                        <span>
                            {translate(
                                `resources.transactions.types.${data?.transactionTypes[
                                    context.record.type
                                ]?.type_descr.toLowerCase()}`
                            )}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.state.state_description")}
                        </span>
                        <span>
                            {translate(
                                `resources.transactions.states.${context.record.state.state_description.toLowerCase()}`
                            )}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.destination.header")}
                        </span>
                        {/* <span>{context.record.destination.meta?.caption}</span> */}
                        <span>{merchantName ?? ""}</span>
                    </div>
                </div>
                <SimpleTable columns={briefHistory} data={history ? history : []} tableType={TableTypes.COLORED} />
                {context.record.committed && (
                    <div className="flex flex-col gap-2 min-h-[100px]">
                        <span>{translate("resources.transactions.fields.fees")}</span>

                        <SimpleTable
                            columns={feesColumns}
                            data={
                                permissions === "admin"
                                    ? context.record.fees
                                    : context.record.fees.filter(item => item.type !== 2)
                            }
                            tableType={TableTypes.COLORED}
                        />
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
                <div className={"flex flex-row flex-wrap justify-between gap-2"}>
                    <div className="flex flex-col gap-2">
                        <TextField
                            label={translate("resources.transactions.fields.id")}
                            text={context.record.id}
                            copyValue
                        />
                        <TextField
                            label={translate("resources.transactions.fields.meta.customer_id")}
                            text={context.record.meta.customer_data.customer_id}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.meta.customer_payment_id")}
                            text={context.record.meta.customer_data.customer_payment_id}
                            copyValue
                        />
                        <TextField
                            label={translate("resources.transactions.fields.type")}
                            text={translate(
                                `resources.transactions.types.${data?.transactionTypes[
                                    context.record.type
                                ]?.type_descr.toLowerCase()}`
                            )}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.state.state_description")}
                            text={context.record.state.state_description}
                        />
                        <BooleanField
                            value={context.record.state.final}
                            label={translate("resources.transactions.fields.state.final")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-muted-foreground mt-5">
                            {translate("resources.transactions.fields.source.header")}
                        </h3>
                        <TextField
                            label={translate("resources.transactions.fields.source.meta.caption")}
                            text={context.record.source.meta?.caption}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.source.amount.value")}
                            text={computeValue(
                                context.record.source.amount.value.quantity,
                                context.record.source.amount.value.accuracy
                            )}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.source.amount.currency")}
                            text={context.record.source.amount.currency}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-muted-foreground mt-5">
                            {translate("resources.transactions.fields.destination.header")}
                        </h3>
                        <TextField
                            label={translate("resources.transactions.fields.destination.meta.caption")}
                            text={context.record.destination.meta?.caption}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.destination.amount.value")}
                            text={computeValue(
                                context.record.destination.amount.value.quantity,
                                context.record.destination.amount.value.accuracy
                            )}
                        />
                        <TextField
                            label={translate("resources.transactions.fields.destination.amount.currency")}
                            text={context.record.destination.amount.currency}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.transactions.fields.fees")}
                    </small>
                    <SimpleTable columns={feesColumns} data={context.record.fees} />
                </div>
                {history && history?.length > 0 && (
                    <div className="mt-5">
                        <small className="text-sm text-muted-foreground">
                            {translate("resources.transactions.fields.history")}
                        </small>
                        <SimpleTable columns={historyColumns} data={history} />
                    </div>
                )}
            </div>
        );
    }
};
