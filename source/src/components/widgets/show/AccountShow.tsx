import { useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { SimpleTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";
import { TextField } from "@/components/ui/text-field";

export const AccountShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const { data } = useQuery(["dictionaries"], () => dataProvider.getDictionaries());
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

    if (context.isLoading || !context.record) {
        return null;
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
