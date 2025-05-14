import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { ShowButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import NatsIcon from "@/lib/icons/NATS.io.svg?react";

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
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-2">
                        <TextField
                            text={row.original.name}
                            lineClamp
                            linesCount={1}
                            maxWidth="100%"
                            className="text-note-1 text-neutral-70"
                        />
                        <TextField text={row.original.id} copyValue lineClamp linesCount={1} maxWidth="100%" />
                    </div>
                );
            }
        },
        {
            id: "Terminal name",
            header: translate("resources.callbridge.mapping.fields.terminal"),
            cell: ({ row }) => {
                const term = row.original.terminal?.verbose_name;

                return (
                    <TextField
                        text={term ?? ""}
                        onClick={
                            term
                                ? () => {
                                      openSheet("terminal", {
                                          id: row.original.terminal?.terminal_id,
                                          provider: row.original.terminal?.provider
                                      });
                                  }
                                : undefined
                        }
                    />
                );
            }
        },
        {
            id: "external_url",
            header: translate("resources.callbridge.mapping.fields.ext_path"),
            cell: ({ row }) => {
                return (
                    <TextField text={row.original.external_path} copyValue lineClamp linesCount={1} maxWidth="250px" />
                );
            }
        },

        {
            id: "internal_path",
            accessorKey: "internal_path",
            header: translate("resources.callbridge.mapping.fields.target"),
            cell: ({ row }) => {
                const int_path = row.original.internal_path;
                const natsQ = row.original.adapter_nats_subject;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3.5">
                            <Link className="h-4 w-4 text-green-50" />
                            <TextField text={int_path ?? ""} copyValue lineClamp linesCount={1} maxWidth="250px" />
                        </div>
                        <div className="flex items-center gap-2">
                            <NatsIcon className="h-7 w-6" />
                            <TextField text={natsQ ?? ""} copyValue lineClamp linesCount={1} maxWidth="250px" />
                        </div>
                    </div>
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
