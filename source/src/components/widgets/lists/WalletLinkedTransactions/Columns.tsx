import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetWalletLinkedTransactionColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const [locale] = useLocaleState();

    const columns: ColumnDef<Wallets.WalletLinkedTransactions>[] = [
        {
            id: "scanned_at",
            accessorKey: "scanned_at",
            header: translate("resources.wallet.linkedTransactions.fields.scannedAt"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original?.scanned_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row.original?.scanned_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "block_timestamp",
            accessorKey: "block_timestamp",
            header: translate("resources.wallet.linkedTransactions.fields.blockTimestamp"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">
                            {new Date(row.original?.block_timestamp).toLocaleDateString(locale)}
                        </p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row.original?.block_timestamp).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "transaction_id",
            accessorKey: "transaction_id",
            header: translate("resources.wallet.linkedTransactions.fields.transactionId"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.transaction_id}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                    className="!text-green-50 dark:!text-green-40 hover:!text-green-40 dark:hover:!text-green-50 !cursor-pointer transition-all duration-300"
                    onClick={() => openSheet("walletLinked", { id: row.original.transaction_id })}
                />
            )
        },
        {
            id: "source_address",
            accessorKey: "source_address",
            header: translate("resources.wallet.linkedTransactions.fields.sourceAddress"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.source_address}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            id: "destnation_address",
            accessorKey: "destnation_address",
            header: translate("resources.wallet.linkedTransactions.fields.destinationAddress"),
            cell: ({ row }) => (
                <TextField
                    text={row.original?.destnation_address}
                    wrap
                    copyValue
                    lineClamp
                    linesCount={1}
                    minWidth="50px"
                />
            )
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.wallet.linkedTransactions.fields.type")
        },
        {
            id: "amount",
            accessorKey: "amount",
            header: translate("resources.wallet.linkedTransactions.fields.amount")
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.wallet.linkedTransactions.fields.currency")
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("walletLinked", { id: row.original.transaction_id });
                        }}
                    />
                );
            }
        }
    ];

    return {
        columns
    };
};
