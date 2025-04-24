import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useLocaleState, useTranslate } from "react-admin";

export const useGetMappingsColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const [locale] = useLocaleState();

    const [createMappingClicked, setCreateMappingClicked] = useState(false);

    const [chosenId, setChosenId] = useState("");
    const [deleteMappingClicked, setDeleteMappingClicked] = useState(false);

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteMappingClicked(true);
    };

    const columns: ColumnDef<CallbackMappingRead>[] = [
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
            id: "id",
            accessorKey: "id",
            header: "ID"
        },
        {
            id: "callback_url",
            header: "Callback URL",
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.callback_url} copyValue lineClamp linesCount={1} maxWidth="100%" />
                );
            }
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.mapping.fields.int_path"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.internal_path} copyValue lineClamp linesCount={1} maxWidth="350px" />
                );
            }
        },
        {
            id: "delete",
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        },
        {
            id: "show",
            cell: ({ row }) => {
                return (
                    <ShowButton
                        onClick={() => {
                            openSheet("callbridgeMappings", { id: row.original.id });
                        }}
                    />
                );
            }
        }
    ];

    return {
        columns,
        chosenId,
        createMappingClicked,
        deleteMappingClicked,
        setDeleteMappingClicked,
        setCreateMappingClicked
    };
};
