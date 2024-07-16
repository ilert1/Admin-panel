import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import { BooleanFiled } from "@/components/ui/boolean-field";
import { TextField } from "@/components/ui/text-field";

export const UserList = () => {
    const listContext = useListController<Users.User>();
    const translate = useTranslate();

    const columns: ColumnDef<Users.User>[] = [
        {
            id: "id",
            accessorKey: "id",
            header: translate("resources.users.fields.id"),
            cell: ({ row }) => <TextField text={row.original.id} copyValue />
        },
        {
            id: "name",
            accessorKey: "name",
            header: translate("resources.users.fields.name")
        },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: translate("resources.users.fields.created_at")
        },
        {
            accessorKey: "active",
            header: translate("resources.users.fields.active"),
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
