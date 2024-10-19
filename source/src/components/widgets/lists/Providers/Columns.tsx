/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";

export const useGetProvidersColumns = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const [providerName, setProviderName] = useState("");
    const [chosenId, setChosenId] = useState("");
    const [showProviderId, setShowProviderId] = useState<string>("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [showOpen, setShowOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleDeleteClicked = async (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };

    const openSheet = (id: string) => {
        setShowProviderId(id);
        setShowOpen(true);
    };

    const handleClickGenerate = async (name: string) => {
        setProviderName(name);
        setDialogOpen(true);
    };

    const columns: ColumnDef<Provider>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.providers.fields.name")
        },
        {
            id: "public_key",
            accessorKey: "public_key",
            header: translate("resources.providers.fields.pk"),
            cell: ({ row }) => {
                if (!row.getValue("public_key")) {
                    return (
                        <Button onClick={() => handleClickGenerate(row.getValue("name"))}>
                            {translate("resources.providers.fields.genKey")}
                        </Button>
                    );
                } else {
                    let text = String(row.getValue("public_key"));
                    if (text.length > 30) {
                        text = text.substring(0, 30) + "...";
                    }
                    return <TextField text={text} copyValue />;
                }
            }
        },
        {
            id: "fields_json_schema",
            accessorKey: "fields_json_schema",
            header: translate("resources.providers.fields.json_schema"),
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
            header: translate("resources.providers.fields.regenKey"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleClickGenerate(row.original.id)} variant={"clearBtn"}>
                            <img src="/reload-round.svg" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "update_field",
            header: translate("app.ui.actions.edit"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleEditClicked(row.original.id)} variant={"clearBtn"}>
                            <Pencil className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        },
        {
            id: "delete_field",
            header: translate("app.ui.actions.delete"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleDeleteClicked(row.original.name)} variant={"clearBtn"}>
                            <Trash2 className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        }
        // {
        //     id: "actions",
        //     cell: ({ row }) => {
        //         return (
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="textBtn" className="h-8 w-8 p-0">
        //                         <span className="sr-only">Open menu</span>
        //                         <MoreHorizontal className="h-4 w-4" />
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="end">
        //                     <DropdownMenuItem onClick={() => openSheet(row.original.id)}>
        //                         {translate("app.ui.actions.quick_show")}
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => navigate(`/provider/${row.original.id}/show`)}>
        //                         {translate("app.ui.actions.show")}
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => navigate(`/provider/${row.original.id}/edit/`)}>
        //                         {translate("app.ui.actions.edit")}
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => handleDeleteClicked(row.original.id)}>
        //                         <p className="text-popover-foreground">{translate("app.ui.actions.delete")}</p>
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem onClick={() => handleClickGenerate(row.original.id)}>
        //                         <p className="text-popover-foreground">
        //                             {translate("resources.providers.fields.regenKey")}
        //                         </p>
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         );
        //     }
        // }
    ];
    return {
        chosenId,
        showProviderId,
        dialogOpen,
        deleteDialogOpen,
        showOpen,
        providerName,
        columns,
        editDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setShowOpen,
        setDialogOpen
    };
};
