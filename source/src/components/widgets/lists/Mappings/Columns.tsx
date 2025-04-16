import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, EditButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetMappingsColumns = () => {
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

    // export interface CallbackMappingRead {
    //     /** Full external path exposed to clients */
    //     external_path: string;
    //     /** Full internal URL path to route the request to */
    //     internal_path: string;
    //     /** Retry behavior configuration for delivery attempts */
    //     retry_policy?: CallbackMappingReadRetryPolicy;
    //     /** Security policy including IP filtering and rate limiting */
    //     security_policy?: CallbackMappingReadSecurityPolicy;
    //     id: string;
    //     created_at: string;
    //     updated_at: string;
    // }

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
            header: translate("resources.callbridge.mapping.fields.ext_path")
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.mapping.fields.int_path")
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
