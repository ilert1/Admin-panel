import { useDataProvider, useGetList, useLocaleState, useShowController, useTranslate } from "react-admin";
import { DataTable, SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useEffect, useState } from "react";
import fetchDictionaries from "@/helpers/get-dictionaries";

export const AccountShow = (props: { id: string; type?: "compact" }) => {
    const { id, type } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const data = fetchDictionaries();
    const dataProvider = useDataProvider();

    const context = useShowController({ id });

    const [transactions, setTransactions] = useState<Transaction.Transaction[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const {
        data: trans,
        isFetching,
        total = 1
    } = useGetList("transactions", {
        filter: {
            accountId: id
        },
        pagination: {
            page: 1,
            perPage: 10
        }
    });

    useEffect(() => {
        if (trans) {
            setTransactions(trans);
        }
    }, [trans]);

    useEffect(() => {
        const refetch = async () => {
            const { data } = await dataProvider.getList("transactions", {
                filter: {
                    accountId: id
                },
                pagination: {
                    page: page,
                    perPage: perPage
                },
                sort: { field: "id", order: "ASC" }
            });
            setTransactions(data);
        };
        refetch();
    }, [dataProvider, id, page, perPage]);

    const columns: ColumnDef<Amount>[] = [
        {
            id: "caption",
            accessorKey: "id",
            header: translate("resources.accounts.fields.amount.id")
        },
        {
            id: "shop_currency",
            accessorKey: "shop_currency",
            header: translate("resources.accounts.fields.amount.shop_currency")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.accounts.fields.amount.type")
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.accounts.fields.amount.currency")
        },
        {
            id: "value",
            accessorKey: "value",
            header: translate("resources.accounts.fields.amount.value"),
            cell: ({ row }) => {
                const value = (row?.original?.value?.quantity || 0) / row?.original?.value?.accuracy;
                if (isNaN(value)) return "-";
                return value.toFixed(Math.log10(row?.original?.value?.accuracy));
            }
        }
    ];

    const historyColumns: ColumnDef<Transaction.Transaction>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row?.original?.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap">{new Date(row?.original?.created_at).toLocaleTimeString(locale)}</p>
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
            cell: ({ row }) => data?.transactionTypes[row?.original?.type]?.type_descr || ""
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
            id: "source",
            accessorKey: "source.amount.value.quantity",
            header: translate("resources.transactions.fields.source.amount.getAmount"),
            cell: ({ row }) => {
                const val = row?.original?.source?.amount.value.quantity / row?.original?.source?.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row?.original?.source?.amount.currency : "-"}</span>
                    </div>
                );
            }
        },
        {
            id: "destination",
            accessorKey: "destination.amount.value.quantity",
            header: translate("resources.transactions.fields.destination.amount.sendAmount"),
            cell: ({ row }) => {
                const val =
                    row?.original?.destination?.amount.value.quantity /
                    row?.original?.destination?.amount.value.accuracy;
                return (
                    <div className="text-center">
                        <span>{val ? val + " " + row?.original?.destination?.amount.currency : "-"}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "rate_info",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => {
                const rateInfo: Transaction.RateInfo = row?.original?.rate_info;
                if (rateInfo) {
                    return (
                        <>
                            <p className="text-neutral-60 dark:text-neutral-70">{`${rateInfo?.s_currency} / ${rateInfo?.d_currency}:`}</p>
                            <p>
                                {((rateInfo?.value.quantity || 0) / rateInfo?.value?.accuracy).toFixed(
                                    Math.log10(rateInfo?.value?.accuracy)
                                )}
                            </p>
                        </>
                    );
                } else {
                    return 0;
                }
            }
        }
    ];

    if (context.isLoading || !context.record || !transactions || isFetching) {
        return <LoadingAlertDialog />;
    }
    if (type === "compact") {
        return (
            <div className="mx-6">
                <DataTable
                    columns={historyColumns}
                    data={transactions}
                    total={total}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField
                    label={translate("resources.accounts.fields.meta.caption")}
                    text={context.record.meta.caption}
                />
                <TextField label={translate("resources.accounts.fields.owner_id")} text={context.record.owner_id} />
                <TextField
                    label={translate("resources.accounts.fields.state")}
                    text={data?.accountStates[context.record.state]?.type_descr}
                />
                <TextField
                    label={translate("resources.accounts.fields.type")}
                    text={data?.accountTypes[context.record.type]?.type_descr}
                />

                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.amounts")}
                    </small>
                    <SimpleTable columns={columns} data={context.record?.amounts} />
                </div>
            </div>
        );
    }
};
