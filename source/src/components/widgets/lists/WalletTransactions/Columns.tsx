/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

export const useGetWalletTransactionsColumns = () => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const data = fetchDictionaries();
    const { openSheet } = useSheets();

    const [chosenId, setChosenId] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { permissions } = usePermissions();

    const handleOpenShowClicked = (id: string) => {
        openSheet("walletTransactions", { id });
    };

    const handleConfirmShowClicked = (id: string) => {
        setChosenId(id);
        setConfirmOpen(true);
    };
    const columns: ColumnDef<Wallets.Cryptotransactions>[] = [
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.wallet.transactions.fields.created_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row.original.created_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "updated_at",
            accessorKey: "updated_at",
            header: translate("resources.wallet.transactions.fields.updated_at"),
            cell: ({ row }) => {
                return (
                    <>
                        <p className="text-nowrap">{new Date(row.original.updated_at).toLocaleDateString(locale)}</p>
                        <p className="text-nowrap text-neutral-70">
                            {new Date(row.original.updated_at).toLocaleTimeString(locale)}
                        </p>
                    </>
                );
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.wallet.transactions.fields.id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                        className="!text-green-50 dark:!text-green-40 hover:!text-green-40 dark:hover:!text-green-50 !cursor-pointer transition-all duration-300"
                        onClick={() => openSheet("walletTransactions", { id: row.original.id })}
                    />
                );
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
                return (
                    <TextField
                        type={row.original.tx_link ? "link" : "text"}
                        link={row.original.tx_link}
                        text={row.original.tx_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "pre_calculated_fee",
            accessorKey: "pre_calculated_fee",
            header: translate("resources.wallet.transactions.fields.pre_calculated_fee"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.pre_calculated_fee >= 0 ? String(row.original.pre_calculated_fee) : ""}
                    />
                );
            }
        },
        {
            id: "total_fee",
            accessorKey: "total_fee",
            header: translate("resources.wallet.transactions.fields.total_fee"),
            cell: ({ row }) => {
                return <TextField text={row.original.total_fee >= 0 ? String(row.original.total_fee) : ""} />;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <ShowButton onClick={() => handleOpenShowClicked(row.original.id)} />;
            }
        }
    ];

    return { columns, chosenId, confirmOpen, setConfirmOpen };
};
