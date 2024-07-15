import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { BooleanFiled } from "@/components/ui/boolean-field";

export const UserList = () => {
    const listContext = useListController<Users.User>();
    const translate = useTranslate();

    const columns: ColumnDef<Users.User>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.users.fields.id")
        },
        {
            id: "name",
            accessorKey: "id",
            header: translate("resources.users.fields.name")
        },
        {
            id: "created_at",
            accessorKey: "id",
            header: translate("resources.users.fields.created_at")
        },
        {
            accessorKey: "sourceValue",
            header: translate("resources.transactions.fields.sourceValue"),
            cell: ({ row }) =>
                row.original.deleted_at ? <BooleanFiled value={false} /> : <BooleanFiled value={true} />
        }
    ];

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <ListContextProvider value={listContext}>
                <DataTable columns={columns} />
            </ListContextProvider>
        );
    }
};
