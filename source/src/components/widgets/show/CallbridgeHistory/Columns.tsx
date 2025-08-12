import { ColumnDef } from "@tanstack/react-table";
import { useTranslate } from "react-admin";

export const useGetCallbridgeHistoryColumns = () => {
    const translate = useTranslate();

    const columns: ColumnDef<any>[] = [
        {
            id: "name",
            header: translate("resources.direction.fields.name"),
            cell: ({ row }) => {
                return <div></div>;
            }
        }
    ];

    return { columns };
};
