import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetMappingsColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const [createMappingClicked, setCreateMappingClicked] = useState(false);

    const [chosenId, setChosenId] = useState("");
    const [deleteMappingClicked, setDeleteMappingClicked] = useState(false);

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteMappingClicked(true);
    };

    const columns: ColumnDef<CallbackMappingRead>[] = [
        {
            id: "id",
            accessorKey: "name",
            header: translate("resources.callbridge.mapping.fields.name")
        },
        {
            id: "external_path",
            accessorKey: "external_path",
            header: translate("resources.callbridge.mapping.fields.ext_path"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.external_path} copyValue lineClamp linesCount={1} maxWidth="100%" />
                );
            }
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.mapping.fields.int_path"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.internal_path} copyValue lineClamp linesCount={1} maxWidth="100%" />
                );
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
        },
        {
            id: "delete",
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
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
