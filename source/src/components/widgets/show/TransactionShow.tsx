import { useDataProvider, useShowController, useTranslate, useGetManyReference } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { BooleanField } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";
import { useMemo } from "react";
import { Loading } from "@/components/ui/loading";

export const TransactionShow = (props: { id: string; type?: "compact" }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
    const translate = useTranslate();

    const context = useShowController({ id: props.id });

    const trnId = useMemo<string>(() => context.record?.id, [context]);

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    function computeValue(quantity: number, accuracy: number) {
        const value = (quantity || 0) / accuracy;
        if (isNaN(value)) return "-";
        return value.toFixed(Math.log10(accuracy));
    }

    const feesColumns: ColumnDef<Transaction.Fee>[] = [
        {
            id: "recipient",
            accessorKey: "id",
            header: translate("resources.transactions.fields.recipient")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => data?.feeTypes[row.original.type]?.type_descr || ""
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

    const historyColumns: ColumnDef<Transaction.Fee>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.transactions.fields.id")
        },
        {
            id: "createdAt",
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.created_at")
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

    if (context.isLoading || context.isFetching || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="relative w-[540] overflow-x-auto flex flex-col gap-2">
                <div
                    className={
                        props.type === "compact"
                            ? "flex flex-col gap-2"
                            : "flex flex-row flex-wrap justify-between gap-2"
                    }>
                    <div className="flex flex-col gap-2">
                        <TextField
                            label={translate("resources.transactions.fields.id")}
                            text={context.record.id}
                            copyValue
                        />
                        <TextField
                            label={translate("resources.transactions.fields.type")}
                            text={data?.transactionTypes[context.record.type]?.type_descr}
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
