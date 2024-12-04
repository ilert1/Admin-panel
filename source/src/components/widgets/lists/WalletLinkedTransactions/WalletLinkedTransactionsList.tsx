import { ListContextProvider, useListController, useLocaleState, usePermissions, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TextField } from "@/components/ui/text-field";
import { WalletLinkedTransactionShow } from "../../show/WalletLinkedTransactions";

export const WalletLinkedTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController(
        permissions === "admin" ? { resource: "reconciliation" } : { resource: "merchant/reconciliation" }
    );

    const translate = useTranslate();
    const [locale] = useLocaleState();
    const [chosenId, setChosenId] = useState("");
    const [quickShowOpen, setQuickShowOpen] = useState(false);

    const columns: ColumnDef<WalletLinkedTransactions>[] = [
        {
            id: "scanned_at",
            accessorKey: "scanned_at",
            header: translate("resources.wallet.linkedTransactions.fields.scannedAt"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original?.scanned_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap">{new Date(row.original?.scanned_at).toLocaleTimeString(locale)}</p>
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
                        <p className="text-nowrap">
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
            header: () => {
                return (
                    <div className="text-center">{translate("resources.wallet.linkedTransactions.fields.more")}</div>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => {
                                setChosenId(row.original?.transaction_id);
                                setQuickShowOpen(true);
                            }}
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-transparent flex items-center">
                            <EyeIcon className="text-green-50 size-7" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <WalletLinkedTransactionShow id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
