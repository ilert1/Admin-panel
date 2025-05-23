import { EditButton, TrashButton } from "@/components/ui/Button";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { PaymentTypeWithId } from "@/data/payment_types";

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
            id: "code",
            accessorKey: "code",
            header: translate("resources.payment_type.fields.code")
        },
        {
            id: "title",
            accessorKey: "title",
            header: translate("resources.payment_type.fields.title")
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
