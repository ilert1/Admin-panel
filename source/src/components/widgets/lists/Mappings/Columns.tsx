import { CallbackMappingRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetMappingsColumns = () => {
    const translate = useTranslate();
    const { openSheet } = useSheets();
    const [createMappingClicked, setCreateMappingClicked] = useState(false);

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
                return <TextField text={row.original.external_path} copyValue />;
            }
        },
        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.mapping.fields.int_path"),
            cell: ({ row }) => {
                return <TextField text={row.original.internal_path} copyValue />;
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
        createMappingClicked,
        setCreateMappingClicked
    };
};
