import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { CallbackHistoryBackup } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { CallbackBackupsDataProvider } from "@/data/callback_backup";

export const useGetCallbackBackupColumns = () => {
    const translate = useTranslate();
    const callbackBackupDataProvider = new CallbackBackupsDataProvider();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleDownloadReport = async (id: string) => {
        // if (adminOnly && !account) {
        //     appToast("error", translate("resources.transactions.download.accountField"));
        //     return;
        // }

        // if (!startDate) {
        //     appToast("error", translate("resources.transactions.download.bothError"));
        //     return;
        // }
        console.log(id);

        try {
            const response = await callbackBackupDataProvider.downloadFile({
                id
            });
            // console.log(response);

            if (!response.data) {
                throw new Error("Network response was not ok");
            }

            const blob = response.data;
            const fileUrl = window.URL.createObjectURL(blob);

            const filename = id;

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error("There was an error downloading the file:", error);
        }
    };

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
        },
        {
            id: "Download",
            // header: translate("resources.callbridge.history_backup.fields.download"),
            cell: ({ row }) => {
                return (
                    <Button onClick={() => handleDownloadReport(row.original.file_name)}>
                        {translate("resources.callbridge.history_backup.fields.download")}
                    </Button>
                );
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
