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
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";

export const useGetDirectionsColumns = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const [chosenId, setChosenId] = useState("");

    const [quickShowOpen, setQuickShowOpen] = useState(false);

    const openSheet = (id: string) => {
        setChosenId(id);
        setQuickShowOpen(true);
    };

    const columns: ColumnDef<Directions.Direction>[] = [
        {
            id: "index",
            header: "№",
            cell: ({ row }) => row.index + 1
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.direction.fields.name")
        },
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.direction.fields.id"),
            cell: ({ row }) => {
                return <TextField text={row.original.id} wrap copyValue />;
            }
        },
        {
            id: "src_currency",
            accessorKey: "src_currency",
            header: translate("resources.direction.fields.srcCurr"),
            cell: ({ row }) => {
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("src_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "dst_currency",
            accessorKey: "dst_currency",
            header: translate("resources.direction.fields.destCurr"),
            cell: ({ row }) => {
                const obj: Omit<Currencies.Currency, "id"> = row.getValue("dst_currency");
                return <TextField text={obj.code} />;
            }
        },
        {
            id: "merchant",
            accessorKey: "merchant",
            header: translate("resources.direction.fields.merchant"),
            cell: ({ row }) => {
                const obj: Merchant = row.getValue("merchant");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                const obj: Provider = row.getValue("provider");
                return <TextField text={obj.name} />;
            }
        },
        {
            id: "weight",
            accessorKey: "weight",
            header: translate("resources.direction.weight")
        },
        {
            id: "active",
            accessorKey: "active",
            header: translate("resources.direction.fields.isActive"),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center text-white">
                        {row.original.active ? (
                            <span className="px-3 py-0.5 bg-green-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                                {translate("resources.direction.fields.stateActive")}
                            </span>
                        ) : (
                            <span className="px-3 py-0.5 bg-red-50 rounded-20 font-normal text-title-2 text-center whitespace-nowrap">
                                {translate("resources.direction.fields.stateInactive")}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center">
                                <Button variant="secondary" className="h-7 w-7 p-0 bg-transparent">
                                    <EyeIcon className="text-green-50 size-7" />
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setChosenId(row.original.id);
                                    openSheet(row.original.id);
                                }}>
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/accounts/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];
    return { columns, chosenId, quickShowOpen, setQuickShowOpen };
};
