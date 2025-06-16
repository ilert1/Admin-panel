import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { useSheets } from "@/components/providers/SheetProvider";
import { useFetchFinancialInstitutionTypes } from "@/hooks/useFetchFinancialInstitutionTypes";
import { CallbackHistoryBackup } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export const useGetCallbackBackupColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: financialInstitutionTypes } = useFetchFinancialInstitutionTypes();
    const columns: ColumnDef<CallbackHistoryBackup>[] = [
        {
            id: "file_name",
            accessorKey: "file_name",
            header: translate("resources.paymentTools.callbackBackup.fields.file_name"),
            cell: ({ row }) => {
                return <TextField text={row.original.file_name || ""} />;
            }
        },
        {
            id: "file_size",
            accessorKey: "file_size",
            header: translate("resources.paymentTools.callbackBackup.fields.file_size"),
            cell: ({ row }) => {
                return <TextField text={String(row.original.file_size) || ""} />;
            }
        },
        {
            id: "created",
            accessorKey: "created",
            header: translate("resources.paymentTools.callbackBackup.fields.created"),
            cell: ({ row }) => {
                return <TextField text={row.original.created || ""} />;
            }
        },
        {
            id: "records_count",
            accessorKey: "records_count",
            header: translate("resources.paymentTools.callbackBackup.fields.records_count"),
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
