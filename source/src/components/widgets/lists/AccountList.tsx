import { useDataProvider, ListContextProvider, useListController } from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";

export const AccountList = () => {
    const listContext = useListController<Account>();

    const columns: ColumnDef<Account>[] = [
        {
            accessorKey: "id",
            header: "ID"
        },
        {
            accessorKey: "owner_id",
            header: "OwnerID"
        },
        {
            accessorKey: "state",
            header: "State"
        }
    ];

    const dataProvider = useDataProvider();
    const { data } = useQuery([], () => dataProvider.getDictionaries());

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <ListContextProvider value={listContext}>
                <div className="text-sm breadcrumbs mb-4">
                    <ul>
                        <li>Products</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-4">
                    <DataTable columns={columns} data={listContext.data} />
                </div>
            </ListContextProvider>
        );
    }
};
