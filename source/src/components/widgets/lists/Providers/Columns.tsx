/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";

import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetProvidersColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [showMethodsOpen, setSowMethodsOpen] = useState(false);

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
        setDialogOpen(true);
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
                        <Button onClick={() => handleClickGenerate(row.original.id)} variant={"clearBtn"}>
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
            header: () => {
                return <div className="text-center">{translate("app.ui.actions.delete")}</div>;
            },
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
    ];
    return {
        chosenId,
        dialogOpen,
        deleteDialogOpen,
        showOpen,
        columns,
        editDialogOpen,
        showMethodsOpen,
        setSowMethodsOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setShowOpen,
        setDialogOpen
    };
};
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
