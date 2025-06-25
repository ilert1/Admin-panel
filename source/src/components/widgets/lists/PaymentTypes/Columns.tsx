import { EditButton, TrashButton } from "@/components/ui/Button";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { PaymentTypeWithId } from "@/data/payment_types";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { TextField } from "@/components/ui/text-field";
import { Badge } from "@/components/ui/badge";

export const useGetPaymentTypesColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const columns: ColumnDef<PaymentTypeWithId>[] = [
        {
            id: "icon",
            header: () => (
                <div className="text-center">{translate("resources.paymentSettings.paymentType.fields.icon")}</div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <PaymentTypeIcon type={row.original.code} metaIcon={row.original.meta?.["icon"] as string} />
                    </div>
                );
            }
        },
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentSettings.paymentType.fields.code")
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.paymentSettings.paymentType.fields.title")
        },
        {
            id: "category",
            accessorKey: "category",
            header: translate("resources.paymentSettings.paymentType.fields.category")
        },
        {
            id: "required_fields_for_payment",
            accessorKey: "required_fields_for_payment",
            header: translate("resources.paymentSettings.paymentType.fields.required_fields_for_payment"),
            cell: ({ row }) => {
                return <TextField text={row.original.required_fields_for_payment?.join(", ") || ""} lineClamp wrap />;
            }
        },
        {
            id: "currencies",
            accessorKey: "currencies",
            header: translate("resources.paymentSettings.paymentType.fields.currencies"),
            cell: ({ row }) => {
                return (
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto">
                        {row.original.currencies &&
                            row.original.currencies.map(value => (
                                <Badge
                                    key={value.code}
                                    className="cursor-default border border-neutral-50 bg-transparent font-normal hover:bg-transparent">
                                    <span className="max-w-28 overflow-hidden text-ellipsis break-words">
                                        {value.code}
                                    </span>
                                </Badge>
                            ))}
                    </div>
                );
            }
        },
        {
            id: "update_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.edit")}</div>;
            },
            cell: ({ row }) => {
                return <EditButton onClick={() => handleEditClicked(row.original.id)} />;
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        }
    ];
    return {
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        createDialogOpen,
        columns,
        setDeleteDialogOpen,
        setEditDialogOpen,
        setCreateDialogOpen
    };
};
