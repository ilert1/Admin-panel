import { useTranslate, useListController, ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { ColumnDef } from "@tanstack/react-table";

export const WithdrawList = () => {
    const listContext = useListController<Transaction.Transaction>();
    const translate = useTranslate();

    const columns: ColumnDef<Transaction.Transaction>[] = [
        {
            accessorKey: "id",
            header: translate("resources.withdraw.fields.id")
        },
        {
            accessorKey: "created_at",
            header: translate("resources.withdraw.fields.created_at")
        },
        {
            accessorKey: "destination.id",
            header: translate("resources.withdraw.fields.destination.id")
        },
        {
            accessorKey: "destination.amount.value",
            header: translate("resources.withdraw.fields.destination.amount.value"),
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
            accessorKey: "destination.amount.currency",
            header: translate("resources.withdraw.fields.destination.amount.currency")
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <ListContextProvider value={listContext}>
                <DataTable columns={columns} />
            </ListContextProvider>
        );
    }
};
