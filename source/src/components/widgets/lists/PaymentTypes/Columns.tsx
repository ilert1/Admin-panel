import { EditButton, TrashButton } from "@/components/ui/Button";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { PaymentTypeWithId } from "@/data/payment_types";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { TextField } from "@/components/ui/text-field";

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
                <div className="text-center">{translate("resources.paymentTools.paymentType.fields.icon")}</div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        {row.original.meta?.icon ? (
                            <img
                                src={row.original.meta["icon"]}
                                alt="icon"
                                className="h-6 w-6 fill-white object-contain"
                            />
                        ) : (
                            <PaymentTypeIcon type={row.original.code} />
                        )}
                    </div>
                );
            }
        },
        {
            id: "code",
            accessorKey: "code",
            header: translate("resources.paymentTools.paymentType.fields.code")
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.paymentTools.paymentType.fields.title")
        },
        {
            id: "category",
            accessorKey: "category",
            header: translate("resources.paymentTools.paymentType.fields.category")
        },
        {
            id: "required_fields_for_payment",
            accessorKey: "required_fields_for_payment",
            header: translate("resources.paymentTools.paymentType.fields.required_fields_for_payment"),
            cell: ({ row }) => {
                return <TextField text={row.original.required_fields_for_payment?.join(", ") || ""} lineClamp wrap />;
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
