import { ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetCurrencyColumns = () => {
    const translate = useTranslate();

    const [currencyId, setCurrencyId] = useState("");

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddCurrencyDialog, setShowAddCurrencyDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const columns: ColumnDef<Currencies.Currency>[] = [
        {
            id: "id",
            accessorKey: "code",
            header: translate("resources.currency.fields.currency")
        },
        {
            id: "is_coin",
            accessorKey: "is_coin",
            header: translate("resources.currency.fields.type"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("is_coin") === false
                                ? translate("resources.currency.fields.fiat")
                                : translate("resources.currency.fields.crypto")
                        }
                    />
                );
            }
        },
        {
            id: "symbol",
            accessorKey: "symbol",
            header: translate("resources.currency.fields.symbol")
        },
        {
            id: "position",
            accessorKey: "position",
            header: translate("resources.currency.fields.symbPos"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("position") === "before"
                                ? translate("resources.currency.fields.before")
                                : translate("resources.currency.fields.after")
                        }
                    />
                );
            }
        },
        {
            id: "exmaple",
            header: translate("resources.currency.fields.example"),
            cell: ({ row }) => {
                return row.original.position === "before" ? `${row.original.symbol}100` : `100${row.original.symbol}`;
            }
        },
        {
            id: "actionEdit",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.edit")}</div>,
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            setCurrencyId(row.original.id);
                            setShowEditDialog(true);
                        }}
                    />
                );
            }
        },
        {
            id: "actionDelete",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.delete")}</div>,
            cell: ({ row }) => {
                return (
                    <TrashButton
                        onClick={() => {
                            setCurrencyId(row.original.id);
                            setShowDeleteDialog(true);
                        }}
                    />
                );
            }
        }
    ];

    return {
        columns,
        currencyId,
        showEditDialog,
        setShowEditDialog,
        showAddCurrencyDialog,
        setShowAddCurrencyDialog,
        showDeleteDialog,
        setShowDeleteDialog
    };
};
