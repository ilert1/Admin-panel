import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ColumnDef } from "@tanstack/react-table";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetCallbridgeHistory = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();

    const [locale] = useLocaleState();

    const data = fetchDictionaries();
    console.log(data);

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
                return <TextField text={row.original.request_url} maxWidth="100%" lineClamp linesCount={1} copyValue />;
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
                return <TextField text={row.original.status} maxWidth="100%" />;
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
