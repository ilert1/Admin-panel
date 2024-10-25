/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useTranslate } from "react-admin";
export const useGetWalletTransactionsColumns = () => {
    const translate = useTranslate();

    const columns: ColumnDef<Cryptotransactions>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.manageTransactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <div>
                        <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
                        <p>{new Date(row.original.created_at).toLocaleTimeString()}</p>
                    </div>
                );
            }
        },
        {
            id: "updated_at",
            accessorKey: "updated_at",
            header: translate("resources.manageTransactions.fields.updated_at"),
            cell: ({ row }) => {
                return (
                    <div>
                        <p>{new Date(row.original.updated_at).toLocaleDateString()}</p>
                        <p>{new Date(row.original.updated_at).toLocaleTimeString()}</p>
                    </div>
                );
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.manageTransactions.fields.id"),
            cell: ({ row }) => {
                return <TextField text={row.original.id} wrap copyValue />;
            }
        },
        {
            id: "src_wallet",
            accessorKey: "src_wallet",
            header: translate("resources.manageTransactions.fields.src_wallet"),
            cell: ({ row }) => {
                return <TextField text={row.original.src_wallet} wrap copyValue />;
            }
        },
        {
            id: "dst_wallet",
            accessorKey: "dst_wallet",
            header: translate("resources.manageTransactions.fields.dst_wallet"),
            cell: ({ row }) => {
                return <TextField text={row.original.dst_wallet} wrap copyValue />;
            }
        },
        {
            id: "amount",
            accessorKey: "amount_quantity",
            header: translate("resources.manageTransactions.fields.amount"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.amount_quantity / row.original.amount_accuracy)} />;
            }
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.manageTransactions.fields.currency")
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.manageTransactions.fields.state")
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.manageTransactions.fields.type")
        },
        {
            id: "merchant_id",
            accessorKey: "merchant_id",
            header: translate("resources.manageTransactions.fields.merchant_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.merchant_id} wrap copyValue />;
            }
        },
        {
            id: "tx_id",
            accessorKey: "tx_id",
            header: translate("resources.manageTransactions.fields.tx_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.tx_id} wrap copyValue />;
            }
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.manageTransactions.fields.currency"),
            cell: ({ row }) => {
                return <TextField text={row.original.currency} wrap copyValue />;
            }
        }
    ];

    return { columns };
};
