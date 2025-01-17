import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export type MerchantTypeToShow = "fees" | "directions" | undefined;

export const useGetTerminalColumns = () => {
    const translate = useTranslate();

    const [showAuthKeyOpen, setShowAuthKeyOpen] = useState(false);
    const [chosenId, setChosenId] = useState("");
    const [authData, setAuthData] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Directions.Terminal>[] = [
        {
            id: "index",
            header: "№",
            cell: ({ row }) => row.index + 1
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.terminals.fields.id"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.terminal_id}
                        wrap
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "verbose_name",
            accessorKey: "verbose_name",
            header: translate("resources.terminals.fields.verbose_name")
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.terminals.fields.description"),
            cell: ({ row }) => {
                return <TextField text={row.original.description ? row.original?.description : ""} wrap />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.terminals.fields.provider"),
            cell: ({ row }) => {
                return <TextField text={row.original.provider} />;
            }
        },
        {
            id: "auth",
            accessorKey: "auth",
            header: translate("resources.terminals.fields.auth"),
            cell: ({ row }) => {
                const buttonDisabeled = Object.keys(row.original.auth).length === 0;
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            disabled={buttonDisabeled}
                            onClick={() => {
                                setAuthData(JSON.stringify(row.original.auth));
                                setShowAuthKeyOpen(true);
                            }}
                            variant="text_btn"
                            className="h-7 w-7 p-0 bg-transparent">
                            <EyeIcon className="size-7" />
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
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleEditClicked(row.original.terminal_id)} variant={"text_btn"}>
                            <Pencil className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "delete_field",
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleDeleteClicked(row.original.terminal_id)} variant={"text_btn"}>
                            <Trash2 className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return {
        columns,
        showAuthKeyOpen,
        setShowAuthKeyOpen,
        chosenId,
        authData,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen
    };
};
