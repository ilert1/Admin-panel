import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { CallbackHistoryBackup } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export const useGetCallbackBackupColumns = () => {
    const translate = useTranslate();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const columns: ColumnDef<CallbackHistoryBackup>[] = [
        {
            id: "file_name",
            accessorKey: "file_name",
            header: translate("resources.callbridge.history_backup.fields.file_name"),
            cell: ({ row }) => {
                return <TextField text={row.original.file_name || ""} />;
            }
        },
        {
            id: "file_size",
            accessorKey: "file_size",
            header: translate("resources.callbridge.history_backup.fields.file_size"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.file_size) || ""} />;
            }
        },
        {
            id: "created",
            accessorKey: "created",
            header: translate("resources.callbridge.history_backup.fields.created"),
            cell: ({ row }) => {
                return <TextField text={row.original.created || ""} />;
            }
        },
        {
            id: "records_count",
            accessorKey: "records_count",
            header: translate("resources.callbridge.history_backup.fields.records_count"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.records_count) || ""} />;
            }
        }
    ];
    return {
        translate,
        createDialogOpen,
        columns,
        setCreateDialogOpen
    };
};
