import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

export const useGetDirectionsShowColumns = () => {
    const translate = useTranslate();

    const columns: ColumnDef<Directions.Direction>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.direction.fields.id")
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.direction.fields.name")
        },
        {
            id: "active",
            accessorKey: "active",
            header: translate("resources.direction.fields.active"),
            cell: ({ row }) => {
                return (
                    <TextField
                        text={
                            row.getValue("active")
                                ? translate("resources.direction.fields.stateActive")
                                : translate("resources.direction.fields.stateInactive")
                        }
                    />
                );
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
        }
    ];
    return { columns };
};
