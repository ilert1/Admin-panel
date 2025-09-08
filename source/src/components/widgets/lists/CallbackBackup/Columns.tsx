import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { CallbackHistoryBackup } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { CallbackBackupsDataProvider } from "@/data/callback_backup";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export const useGetCallbackBackupColumns = () => {
    const translate = useTranslate();
    const callbackBackupDataProvider = new CallbackBackupsDataProvider();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const appToast = useAppToast();
    const handleDownloadReport = async (id: string) => {
        setButtonDisabled(true);
        try {
            const response = await callbackBackupDataProvider.downloadFile({
                id
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const blob = await response.blob();

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const contentDisposition = response.headers.get("Content-Disposition");
            const fileNameMatch = contentDisposition?.match(/filename="?(.+?)"?$/);
            const fileName = fileNameMatch?.[1] || id;

            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        } finally {
            setButtonDisabled(false);
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
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Button disabled={buttonDisabled} onClick={() => handleDownloadReport(row.original.file_name)}>
                            {translate("resources.callbridge.history_backup.fields.download")}
                        </Button>
                    </div>
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
