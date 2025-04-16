import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, EditButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetCallbridgeHistory = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");
    const { openSheet } = useSheets();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleShowClicked = (id: string, merchantName: string) => {
        openSheet("merchant", { id, merchantName });
    };

    const columns: ColumnDef<Merchant>[] = [
        {
            id: "id",
            header: translate("resources.callbridge.mapping.fields.verbose_name"),
            cell: ({ row }) => {
                return <div></div>;
            }
        },
        {
            id: "external_path",
            accessorKey: "external_path",
            header: translate("resources.callbridge.history.fields.request_url")
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.history.fields.original_url")
        },
        {
            id: "external_path",
            accessorKey: "external_path",
            header: translate("resources.callbridge.history.fields.mapping_id")
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.history.fields.created_at")
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.history.fields.status")
        }
    ];

    return {
        columns,
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen
    };
};
