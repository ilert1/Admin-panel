import { useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { BooleanFiled } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";

export const TransactionShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());
    const translate = useTranslate();

    const context = useShowController({ id: props.id });

    const columns: ColumnDef<Amount>[] = [
        {
            id: "caption",
            accessorKey: "id",
            header: translate("resources.accounts.fields.amount.id")
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
            cell: ({ row }) =>
                ((row.original.value.quantity || 0) / row.original.value.accuracy).toFixed(
                    Math.log10(row.original.value.accuracy)
                )
        }
    ];
    if (context.isLoading || context.isFetching || !context.record) {
        return "Loading...";
    } else {
        return (
            <div className="flex flex-col gap-2">
                <TextField label={translate("resources.transactions.fields.id")} text={context.record.id} />
                <TextField
                    label={translate("resources.transactions.fields.type")}
                    text={data?.transactionTypes[context.record.type]?.type_descr}
                />
                <TextField
                    label={translate("resources.transactions.fields.state.state_description")}
                    text={context.record.state.state_description}
                />

                <BooleanFiled
                    value={context.record.state.final}
                    label={translate("resources.transactions.fields.state.final")}
                />
                <h3 className="text-muted-foreground mt-5">
                    {translate("resources.transactions.fields.source.header")}
                </h3>
                <TextField
                    label={translate("resources.transactions.fields.source.meta.caption")}
                    text={context.record.source.meta.caption}
                />
                <TextField
                    label={translate("resources.transactions.fields.source.amount.value")}
                    text={(
                        (context.record.source.amount.value.quantity || 0) / context.record.source.amount.value.accuracy
                    ).toFixed(Math.log10(context.record.source.amount.value.accuracy))}
                />
                <TextField
                    label={translate("resources.transactions.fields.source.amount.currency")}
                    text={context.record.source.amount.currency}
                />
                <h3 className="text-muted-foreground mt-5">
                    {translate("resources.transactions.fields.destination.header")}
                </h3>
                <TextField
                    label={translate("resources.transactions.fields.destination.meta.caption")}
                    text={context.record.destination.meta.caption}
                />
                <TextField
                    label={translate("resources.transactions.fields.destination.amount.value")}
                    text={(
                        (context.record.destination.amount.value.quantity || 0) /
                        context.record.destination.amount.value.accuracy
                    ).toFixed(Math.log10(context.record.destination.amount.value.accuracy))}
                />
                <TextField
                    label={translate("resources.transactions.fields.destination.amount.currency")}
                    text={context.record.destination.amount.currency}
                />
                {/* <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.accounts.fields.amounts")}
                    </small>
                    <DataTable columns={columns} data={context.record.amounts} pagination={false} />
                </div> */}
            </div>
        );
    }
};
