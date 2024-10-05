import { useDataProvider, useGetManyReference, useListContext, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { TableTypes } from "../shared/SimpleTable";

export const AccountShow = (props: { id: string; type?: "compact" }) => {
    const { id, type } = props;
    const translate = useTranslate();

    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const context = useShowController({ id });

    const trnId = useMemo<string>(() => context.record?.id, [context]);

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id,
        filter: {
            account: id
        }
    });

    const [transactions, setTransactions] = useState<Transaction.Transaction[]>([]);

    useEffect(() => {
        async function getData() {
            const data = await dataProvider.getList<Transaction.Transaction>("transactions", {
                sort: {
                    order: "ASC",
                    field: "id"
                },
                filter: { account: id },
                pagination: {
                    page: 1,
                    perPage: 10
                }
            });
            setTransactions(data.data);
        }

        getData();
    }, [dataProvider, id]);

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
                const value = (row.original.value.quantity || 0) / row.original.value.accuracy;
                if (isNaN(value)) return "-";
                return value.toFixed(Math.log10(row.original.value.accuracy));
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
                    <div>
                        <span>{moment(row.original.created_at).format("DD.MM.YY")}</span>
                        <br />
                        <span>{moment(row.original.created_at).format("hh:mm:ss")}</span>
                    </div>
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
            cell: ({ row }) => data?.transactionTypes[row.original.type]?.type_descr || ""
        },
        {
            id: "state",
            accessorKey: "state.state_description",
            header: translate("resources.transactions.fields.state.title")
        },
        {
            id: "final",
            // accessorKey: "state.final",
            accessorKey: "state.final",
            header: translate("resources.transactions.fields.state.final")
        },
        // {
        //     id: "type",
        //     accessorKey: "type",
        //     header: translate("resources.accounts.fields.amount.type")
        // },
        // {
        //     id: "currency",
        //     accessorKey: "currency",
        //     header: translate("resources.accounts.fields.amount.currency")
        // },

        {
            id: "source",
            accessorKey: "source.amount.value.quantity",
            header: translate("resources.transactions.fields.source.amount.getAmount"),
            cell: ({ row }) => {
                return (
                    row.original.source.amount.value.quantity / row.original.source.amount.value.accuracy +
                    " " +
                    row.original.rate_info.s_currency
                );
            }
        },
        {
            id: "destination",
            accessorKey: "destination.amount.value.quantity",
            header: translate("resources.transactions.fields.destination.amount.sendAmount"),
            cell: ({ row }) => {
                return (
                    row.original.destination.amount.value.quantity / row.original.destination.amount.value.accuracy +
                    " " +
                    row.original.rate_info.d_currency
                );
            }
        }
    ];
    console.log(history);

    if (context.isLoading || !context.record || !transactions) {
        return <Loading />;
    }
    console.log(transactions);
    console.log(data);
    if (type === "compact") {
        return (
            <>
                <SimpleTable columns={historyColumns} data={transactions} tableType={TableTypes.COLORED}></SimpleTable>
            </>
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
                    <SimpleTable columns={columns} data={context.record.amounts} />
                </div>
            </div>
        );
    }
};
