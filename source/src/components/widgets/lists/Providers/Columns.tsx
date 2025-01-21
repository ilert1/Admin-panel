/* eslint-disable react-hooks/rules-of-hooks */
import { Button, EditButton, TrashButton } from "@/components/ui/Button";

import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetProvidersColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [showMethodsOpen, setSowMethodsOpen] = useState(false);
    const [confirmKeysCreatingOpen, setConfirmKeysCreatingOpen] = useState(false);

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleClickGenerate = async (id: string) => {
        setChosenId(id);
        setConfirmKeysCreatingOpen(true);
    };

    const handleShowMethodsClicked = (id: string) => {
        setChosenId(id);
        setSowMethodsOpen(true);
    };

    const columns: ColumnDef<Provider>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.provider.fields.name")
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.provider.fields.pk"),
            cell: ({ row }) => {
                if (!row.getValue("public_key")) {
                    return (
                        <Button onClick={() => handleClickGenerate(row.getValue("name"))}>
                            {translate("resources.provider.fields.genKey")}
                        </Button>
                    );
                } else {
                    const text = String(row.getValue("public_key"));

                    return <TextField text={text} copyValue lineClamp />;
                }
            }
        },
        {
            id: "fields_json_schema",
            accessorKey: "fields_json_schema",
            header: translate("resources.provider.fields.json_schema"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("fields_json_schema")
                                ? String(row.getValue("fields_json_schema")).length > 30
                                    ? String(row.getValue("fields_json_schema")).substring(0, 30) + "..."
                                    : row.getValue("fields_json_schema")
                                : ""
                        }
                    />
                );
            }
        },
        {
            id: "show_methods",
            header: () => {
                return <div className="text-center">{translate("resources.provider.fields.methods")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => handleShowMethodsClicked(row.original.id)}
                            variant="secondary"
                            className="h-7 w-7 p-0 bg-transparent">
                            <EyeIcon className="text-green-50 size-7" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "recreate_field",
            header: () => {
                return <div className="text-center">{translate("resources.provider.fields.regenKey")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleClickGenerate(row.original.id)} variant={"text_btn"}>
                            <img src="/reload-round.svg" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "update_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.edit")}</div>;
            },
            cell: ({ row }) => {
                return <EditButton onClick={() => handleEditClicked(row.original.id)} />;
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return <TrashButton onClick={() => handleDeleteClicked(row.original.name)} />;
            }
        }
    ];
    return {
        chosenId,
        dialogOpen,
        deleteDialogOpen,
        columns,
        editDialogOpen,
        showMethodsOpen,
        confirmKeysCreatingOpen,
        setSowMethodsOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setDialogOpen,
        setConfirmKeysCreatingOpen
    };
};
