/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

export const useGetDirectionsColumns = () => {
    const translate = useTranslate();

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
                return <TextField text={row.original.id} wrap copyValue lineClamp linesCount={1} minWidth="50px" />;
            }
        },
        {
            id: "account_id",
            accessorKey: "account_id",
            header: translate("resources.direction.fields.accountNumber"),
            cell: ({ row }) => {
                return <TextField text={row.original.account_id} wrap copyValue />;
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
                return <TextField text={obj.name} wrap />;
            }
        },
        {
            id: "provider",
            accessorKey: "provider",
            header: translate("resources.direction.provider"),
            cell: ({ row }) => {
                const obj: Provider = row.getValue("provider");
                return <TextField text={obj.name} wrap />;
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
            header: () => {
                return <div className="text-center">{translate("resources.direction.fields.isActive")}</div>;
            },
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
                    <Button
                        onClick={() => {
                            setChosenId(row.original.id);
                            openSheet(row.original.id);
                        }}
                        variant="secondary"
                        className="h-7 w-7 p-0 bg-transparent flex items-center">
                        <EyeIcon className="text-green-50 size-7" />
                    </Button>
                );
            }
        }
    ];
    return { columns, chosenId, quickShowOpen, setQuickShowOpen };
};
