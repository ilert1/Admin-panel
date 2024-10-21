import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { CircleArrowRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetMerchantsColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [feesDialog, setFeesDialog] = useState(false);

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };
    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };
    // const handleFeesClicked = (id: string) => {
    //     setChosenId(id);
    //     setFeesDialog(true);
    // };

    const columns: ColumnDef<Merchant>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.merchants.fields.merchant"),
            cell: ({ row }) => {
                return (
                    <div>
                        <TextField text={row.original.name} />
                        <TextField copyValue text={row.original.id} />
                    </div>
                );
            }
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.merchants.fields.descr")
        },
        {
            id: "keycloak_id",
            accessorKey: "keycloak_id",
            header: "Keycloak ID"
        },
        // {
        //     id: "update_field",
        //     header: translate("resources.merchants.fields.fees"),
        //     cell: ({ row }) => {
        //         return (
        //             <div className="flex items-center justify-center">
        //                 <Button onClick={() => handleFeesClicked(row.original.id)} variant={"clearBtn"}>
        //                     <CircleArrowRight className="text-green-50" />
        //                 </Button>
        //             </div>
        //         );
        //     }
        // },
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
                        <Button onClick={() => handleDeleteClicked(row.original.id)} variant={"clearBtn"}>
                            <Trash2 className="text-green-50" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return {
        columns,
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen
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
//                     <DropdownMenuItem onClick={() => navigate(`/merchant/${row.original.id}/show`)}>
//                         {translate("app.ui.actions.show")}
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => navigate(`/merchant/${row.original.id}/edit/`)}>
//                         {translate("app.ui.actions.edit")}
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => handleDeleteClicked(row.original.id)}>
//                         <p className="text-popover-foreground">{translate("app.ui.actions.delete")}</p>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         );
//     }
// }
