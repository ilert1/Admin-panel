import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CallbridgeDataProvider } from "@/data";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useRefresh, useTranslate } from "react-admin";

export const useGetCallbridgeHistory = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const [locale] = useLocaleState();
    const appToast = useAppToast();
    const refresh = useRefresh();

    const dataProvider = new CallbridgeDataProvider();
    const [retryButtonClicked, setRetryButtonClicked] = useState(false);

    const handleRetryClicked = async (id: string) => {
        if (retryButtonClicked) return;
        setRetryButtonClicked(true);
        try {
            await dataProvider.retryHistory({ id });
            appToast("success", translate("app.ui.toast.success"), "");
        } catch (error) {
            if (error instanceof Error) appToast("error", "", error.message);
            else appToast("error", translate("app.ui.edit.editError"));
        } finally {
            setRetryButtonClicked(false);
            refresh();
        }
    };

    const columns: ColumnDef<CallbackHistoryRead>[] = [
        {
            accessorKey: "created_at",
            header: translate("resources.transactions.fields.createdAt"),
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{new Date(row.original.created_at).toLocaleDateString(locale)}</p>
                    <p className="text-nowrap text-neutral-70">
                        {new Date(row.original.created_at).toLocaleTimeString(locale)}
                    </p>
                </>
            )
        },
        {
            id: "external_path",
            accessorKey: "external_path",
            header: translate("resources.callbridge.history.fields.request_url"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.request_url} maxWidth="500px" lineClamp linesCount={1} copyValue />
                );
            }
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.history.fields.original_url"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.original_url} maxWidth="100%" lineClamp linesCount={1} copyValue />
                );
            }
        },
        {
            id: "mapping_id",
            accessorKey: "external_path",
            header: translate("resources.callbridge.history.fields.mapping_id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.mapping_id}
                        maxWidth="100%"
                        lineClamp
                        linesCount={1}
                        copyValue
                        onClick={() => {
                            openSheet("callbridgeMappings", { id: row.original.mapping_id });
                        }}
                    />
                );
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: translate("resources.callbridge.history.fields.status"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={translate(`resources.callbridge.history.callbacksStatus.${row.original.status}`)}
                        maxWidth="100%"
                    />
                );
            }
        },
        {
            id: "state",
            cell: ({ row }) => {
                return (
                    <>
                        <Button
                            onClick={() => handleRetryClicked(row.original.callback_id)}
                            disabled={retryButtonClicked}>
                            {retryButtonClicked ? (
                                <div className="overflow-hidden px-4">
                                    <LoadingBlock className="!h-4 !w-4" />
                                </div>
                            ) : (
                                translate("resources.callbridge.history.callbacksStatus.retryCallback")
                            )}
                        </Button>
                    </>
                );
            }
        },
        {
            id: "show",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("callbridgeHistory", { id: row.original.callback_id });
                        }}
                    />
                );
            }
        }
    ];

    return {
        columns
    };
};
