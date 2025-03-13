import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, EditButton, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export type MerchantTypeToShow = "fees" | "directions" | "all" | undefined;

export const useGetMerchantColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showSheetOpen, setShowSheetOpen] = useState(false);
    const [showType, setShowType] = useState<MerchantTypeToShow>();

    const handleEditClicked = (id: string) => {
        setChosenId(id);
        setEditDialogOpen(true);
    };
    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };
    const handleShowClicked = (id: string, type: MerchantTypeToShow) => {
        setChosenId(id);
        setShowType(type);
        setShowSheetOpen(true);
    };

    const columns: ColumnDef<Merchant>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.merchant.merchant"),
            cell: ({ row }) => {
                return (
                    <div>
                        <Button
                            variant={"resourceLink"}
                            onClick={() => {
                                setChosenId(row.original.id ?? "");
                                setShowSheetOpen(true);
                            }}>
                            {row.original.name ?? ""}
                        </Button>
                        <TextField
                            className="text-neutral-70"
                            text={row.original.id}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>
                );
            }
        },
        {
            id: "description",
            accessorKey: "description",
            header: translate("resources.merchant.fields.descr")
        },
        {
            id: "keycloak_id",
            accessorKey: "keycloak_id",
            header: "Keycloak ID",
            cell: ({ row }) => {
                return (
                    <TextField
                        text={row.original.keycloak_id ?? ""}
                        copyValue
                        lineClamp
                        linesCount={1}
                        minWidth="50px"
                    />
                );
            }
        },
        {
            id: "show_fees_field",
            header: () => {
                return <div className="text-center">{translate("resources.merchant.fields.view")}</div>;
            },
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button onClick={() => handleShowClicked(row.original.id, "fees")} variant={"text_btn"}>
                            <EyeIcon className="text-green-50 hover:text-green-40" />
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
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        }
    ];

    return {
        columns,
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        showSheetOpen,
        showType,
        setShowSheetOpen,
        setEditDialogOpen,
        setDeleteDialogOpen
    };
};
