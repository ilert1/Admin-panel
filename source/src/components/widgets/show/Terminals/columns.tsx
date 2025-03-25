import { Fee } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetTransactionShowColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const dataDictionaries = fetchDictionaries();

    function computeValue(quantity: number | undefined, accuracy: number | undefined) {
        if (quantity && accuracy) {
            const value = (quantity || 0) / accuracy;
            if (isNaN(value)) return "-";
            return value.toFixed(Math.log10(accuracy));
        }

        return "-";
    }

    const feesColumns: ColumnDef<Fee>[] = [
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
                    `resources.transactions.types.${dataDictionaries?.feeTypes[
                        row.original.type
                    ]?.type_descr.toLowerCase()}`
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
                    `resources.transactions.types.${dataDictionaries?.transactionTypes[
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

    return { feesColumns, briefHistory };
};
