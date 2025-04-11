import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useSheets } from "@/components/providers/SheetProvider";
import { Button, TrashButton } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetMerchantColumns = () => {
    const translate = useTranslate();

    const [chosenId, setChosenId] = useState("");
    const { openSheet } = useSheets();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClicked = (id: string) => {
        setChosenId(id);
        setDeleteDialogOpen(true);
    };

    const handleShowClicked = (id: string, merchantName: string) => {
        openSheet("merchant", { id, merchantName });
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
                                handleShowClicked(row.original.id ?? "", row.original.name);
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
            id: "fees",
            header: () => {
                return <div className="flex text-center">{translate("resources.merchant.fields.feePay")}</div>;
            },
            cell: ({ row }) => {
                const entries = Object.entries(row.original.fees ?? {});
                const d1 = entries.find(el => el[1].direction === 1);
                const payInValue = d1 && `${String((d1[1].value.quantity ?? 0) / (d1[1].value.accuracy ?? 1))}`;
                const d2 = entries.find(el => el[1].direction === 2);
                const payOutValue = d2 && `${String((d2[1].value.quantity ?? 0) / (d2[1].value.accuracy ?? 1))}`;

                return (
                    <div className="flex justify-start gap-1">
                        {d1 ? (
                            <span className="">
                                <span className="mr-[1px]">{payInValue}</span>
                                <span className="text-note-2 text-neutral-80 dark:text-neutral-40">%</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center text-note-2 text-neutral-80 dark:text-neutral-40">
                                -
                            </span>
                        )}
                        <span>{"/"}</span>
                        {d2 ? (
                            <span className="">
                                <span className="mr-[1px]">{payOutValue}</span>
                                <span className="text-note-2 text-neutral-80 dark:text-neutral-40">%</span>
                            </span>
                        ) : (
                            <span className="flex items-center justify-center text-note-2 text-neutral-80 dark:text-neutral-40">
                                -
                            </span>
                        )}
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
                return <TrashButton onClick={() => handleDeleteClicked(row.original.id)} />;
            }
        },
        {
            id: "show_fees_field",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => handleShowClicked(row.original.id, row.original.name)}
                            variant={"text_btn"}>
                            <EyeIcon className="text-green-50 hover:text-green-40" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return {
        columns,
        chosenId,
        deleteDialogOpen,
        setDeleteDialogOpen
    };
};
