import { Button, EditButton, TrashButton } from "@/components/ui/Button";

import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslate } from "react-admin";
import ReloadRoundSvg from "@/lib/icons/reload_round.svg?react";
import { ProviderWithId } from "@/data/providers";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";

export const useGetProvidersColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");
    const [chosenProviderName, setChosenProviderName] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmKeysCreatingOpen, setConfirmKeysCreatingOpen] = useState(false);

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleClickGenerate = async (id: string, providerName: string) => {
        setChosenId(id);
        setChosenProviderName(providerName);
        setConfirmKeysCreatingOpen(true);
    };

    const columns: ColumnDef<ProviderWithId>[] = [
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
                        <Button onClick={() => handleClickGenerate(row.original.id, row.getValue("name"))}>
                            {translate("resources.provider.fields.genKey")}
                        </Button>
                    );
                } else {
                    const text = String(row.getValue("public_key"));

                    return <TextField text={text} copyValue lineClamp linesCount={1} maxWidth="150px" />;
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
            id: "recreate_field",
            header: () => {
                return <div className="text-center">{translate("resources.provider.fields.regenKey")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => handleClickGenerate(row.original.id, row.original.name)}
                            variant={"text_btn"}>
                            <ReloadRoundSvg className="stroke-green-50 hover:stroke-green-40" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "payment_types",
            header: translate("resources.payment_type.fields.payment_types"),
            cell: ({ row }) => {
                return (
                    <div className="max-w-auto flex flex-wrap gap-2">
                        {row.original.payment_types?.map(pt => {
                            return <PaymentTypeIcon key={pt.code} type={pt.code} className="h-7 w-7" tooltip />;
                        })}
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
        confirmKeysCreatingOpen,
        chosenProviderName,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setDialogOpen,
        setConfirmKeysCreatingOpen
    };
};
