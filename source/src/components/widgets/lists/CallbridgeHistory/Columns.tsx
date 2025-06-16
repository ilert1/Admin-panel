import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, ShowButton } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CallbridgeDataProvider } from "@/data";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

export const useGetCallbridgeHistory = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

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

    const formatDateTime = (date: Date) => {
        const pad = (num: number, size = 2) => String(num).padStart(size, "0");
        if (!date) return "-";
        return (
            pad(date.getDate()) +
            "." +
            pad(date.getMonth() + 1) +
            "." +
            date.getFullYear() +
            " " +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes()) +
            ":" +
            pad(date.getSeconds()) +
            "." +
            pad(date.getMilliseconds(), 3)
        );
    };

    const columns: ColumnDef<CallbackHistoryRead>[] = [
        {
            id: "dates",
            header: () => {
                return (
                    <div className="flex flex-col">
                        <p className="text-base/[1rem]">{translate("resources.callbridge.history.fields.createdAt")}</p>
                        <p className="text-base/[1rem]">
                            {translate("resources.callbridge.history.fields.deliveredAt")}
                        </p>
                    </div>
                );
            },
            cell: ({ row }) => (
                <>
                    <p className="text-nowrap">{formatDateTime(new Date(row.original.created_at))}</p>
                    <p className="text-nowrap text-neutral-70">
                        {formatDateTime(new Date(row.original.delivered_at ?? ""))}
                    </p>
                </>
            )
        },
        {
            id: "mapping_id",
            accessorKey: "external_path",
            header: translate("resources.callbridge.history.fields.mapping_name"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.mapping?.name ?? ""}
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
            id: "callback_id",
            header: translate("resources.callbridge.history.fields.callback_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.callback_id} lineClamp linesCount={1} copyValue />;
            }
        },
        {
            id: "transaction_id",
            header: translate("resources.callbridge.history.fields.transaction_id"),
            cell: ({ row }) => {
                const txId = row.original.transaction_id;
                return (
                    <TextField
                        text={txId ?? ""}
                        lineClamp
                        linesCount={1}
                        copyValue
                        onClick={
                            txId
                                ? () => {
                                      openSheet("transaction", { id: txId });
                                  }
                                : undefined
                        }
                    />
                );
            }
        },
        {
            id: "external_order_id",
            header: translate("resources.callbridge.history.fields.external_order_id"),
            cell: ({ row }) => {
                return <TextField text={row.original.external_order_id ?? ""} lineClamp linesCount={1} copyValue />;
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
