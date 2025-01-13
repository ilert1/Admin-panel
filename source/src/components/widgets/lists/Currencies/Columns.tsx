import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash2 } from "lucide-react";
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
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setCurrencyId(row.original.id);
                                setShowEditDialog(true);
                            }}
                            variant="text_btn"
                            className="h-8 w-8 p-0">
                            <Pen className="h-6 w-6" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "actionDelete",
            header: () => <div className="flex justify-center">{translate("resources.currency.fields.delete")}</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setCurrencyId(row.original.id);
                                setShowDeleteDialog(true);
                            }}
                            variant="text_btn"
                            className="h-8 w-8 p-0">
                            <Trash2 className="h-6 w-6" />
                        </Button>
                    </div>
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
