import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetAccountShowColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const dataDictionaries = fetchDictionaries();

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

    const historyColumns: ColumnDef<Transaction.TransactionView>[] = [
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
            header: translate("resources.transactions.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} wrap copyValue />,
            filterFn: "includesString"
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.transactions.fields.type"),
            cell: ({ row }) => translate(`resources.transactions.types.${row.original.type_text.toLowerCase()}`) || ""
        },
        {
            accessorKey: "state",
            header: translate("resources.transactions.fields.state.title"),
            cell: ({ row }) => translate(`resources.transactions.states.${row.original.state_text.toLowerCase()}`) || ""
        },
        {
            id: "final",
            accessorKey: "state_final",
            header: translate("resources.transactions.fields.state.final")
        },
        {
            id: "source",
            accessorKey: "source.amount.value.quantity",
            header: translate("resources.transactions.fields.source.amount.getAmount"),
            cell: ({ row }) => {
                return `${row.original.source_amount_value} ${row.original.source_amount_currency || ""}`;
            }
        },
        {
            id: "destination",
            accessorKey: "destination.amount.value.quantity",
            header: translate("resources.transactions.fields.destination.amount.sendAmount"),
            cell: ({ row }) => {
                return `${row.original.destination_amount_value} ${row.original.destination_amount_currency || ""}`;
            }
        },
        {
            accessorKey: "rate_info",
            header: translate("resources.transactions.fields.rateInfo"),
            cell: ({ row }) => (
                <>
                    <p className="text-neutral-60 dark:text-neutral-70">{`${row.original.rate_source_currency} / ${row.original.rate_destination_currency}:`}</p>
                    <p>{row.original.rate}</p>
                </>
            )
        }
    ];

    return { columns, historyColumns, dataDictionaries };
};
