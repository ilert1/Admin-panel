import { Badge } from "@/components/ui/badge";
import { EditButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { CurrencyWithId } from "@/data/currencies";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ListControllerResult, useTranslate } from "react-admin";
import { ColumnSortingButton, SortingState } from "../../shared";

export const useGetCurrencyColumns = ({ listContext }: { listContext: ListControllerResult }) => {
    const translate = useTranslate();

    const [currencyId, setCurrencyId] = useState("");
    const [sort, setSort] = useState<SortingState>({
        field: listContext.sort.field || "",
        order: listContext.sort.order || "ASC"
    });
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const columns: ColumnDef<CurrencyWithId>[] = [
        {
            id: "code",
            accessorKey: "code",
            header: ({ column }) => (
                <ColumnSortingButton
                    title={translate("resources.currency.fields.currency")}
                    order={sort.field === column.id ? sort.order : undefined}
                    onChangeOrder={order => {
                        setSort({ field: column.id, order });
                        listContext.setSort({ field: column.id, order });
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                    <Badge variant="currency">{row.original.code}</Badge>
                </div>
            )
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
            id: "accuracy",
            header: translate("resources.currency.fields.accuracy"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.accuracy) ?? ""} />;
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
                    <EditButton
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
        showDeleteDialog,
        setShowDeleteDialog
    };
};
