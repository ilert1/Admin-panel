/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { usePermissions, useTranslate } from "react-admin";

export const useGetWalletTransactionsColumns = () => {
    const translate = useTranslate();
    const data = fetchDictionaries();
    const [chosenId, setChosenId] = useState("");
    const [openShowClicked, setOpenShowClicked] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { permissions } = usePermissions();

    const handleOpenShowClicked = (id: string) => {
        setChosenId(id);
        setOpenShowClicked(true);
    };

    const handleConfirmShowClicked = (id: string) => {
        setChosenId(id);
        setConfirmOpen(true);
    };
    const columns: ColumnDef<Cryptotransactions>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.wallet.transactions.fields.created_at"),
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
            header: translate("resources.wallet.transactions.fields.updated_at"),
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
            header: translate("resources.wallet.transactions.fields.id"),
            cell: ({ row }) => {
                return <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />;
            }
        },
        {
            id: "src_wallet",
            accessorKey: "src_wallet",
            header: translate("resources.wallet.transactions.fields.src_wallet"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.src_wallet} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
                );
            }
        },
        {
            id: "dst_wallet",
            accessorKey: "dst_wallet",
            header: translate("resources.wallet.transactions.fields.dst_wallet"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.dst_wallet} wrap copyValue lineClamp linesCount={1} minWidth="50px" />
                );
            }
        },
        {
            id: "amount",
            accessorKey: "amount_quantity",
            header: translate("resources.wallet.transactions.fields.amount"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.amount_quantity / row.original.amount_accuracy)} />;
            }
        },
        {
            id: "currency",
            accessorKey: "currency",
            header: translate("resources.wallet.transactions.fields.currency")
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.wallet.transactions.fields.state"),
            cell: ({ row }) => {
                if (permissions === "admin" && (row.original.state === 21 || row.original.state === "21")) {
                    return (
                        <>
                            <Button onClick={() => handleConfirmShowClicked(row.original.id)}>
                                {translate("resources.wallet.transactions.fields.confirm")}
                            </Button>
                        </>
                    );
                } else {
                    return translate(
                        `resources.transactions.states.${data?.states?.[
                            row.getValue("state") as string
                        ]?.state_description?.toLowerCase()}`
                    );
                }
            }
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.wallet.transactions.fields.type"),
            cell: ({ row }) => data?.transactionTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            id: "merchant_id",
            accessorKey: "merchant_id",
            header: translate("resources.wallet.transactions.fields.merchant_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.merchant_id} wrap copyValue />;
            }
        },
        {
            id: "tx_id",
            accessorKey: "tx_id",
            header: translate("resources.wallet.transactions.fields.tx_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.tx_id} wrap copyValue />;
            }
        },
        {
            id: "actions",
            header: () => {
                return <div className="text-center">{translate("resources.wallet.manage.fields.more")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => handleOpenShowClicked(row.original.id)}
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-transparent flex items-center">
                            <EyeIcon className="text-green-50 size-7" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return { columns, chosenId, openShowClicked, confirmOpen, setConfirmOpen, setOpenShowClicked };
};
