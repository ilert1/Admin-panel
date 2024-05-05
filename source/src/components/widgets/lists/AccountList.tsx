import { useDataProvider, ListContextProvider, useListController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";

export const AccountList = () => {
    const listContext = useListController<Account>();
    const translate = useTranslate();

    const { data } = useQuery([], () => dataProvider.getDictionaries());

    const columns: ColumnDef<Account>[] = [
        {
            accessorKey: "meta.caption",
            header: translate("resources.accounts.fields.meta.caption")
        },
        {
            accessorKey: "owner_id",
            header: translate("resources.accounts.fields.owner_id")
        },
        {
            accessorKey: "state",
            header: translate("resources.accounts.fields.state"),
            cell: ({ row }) => data?.accountStates?.[row.getValue("state") as any]?.type_descr || ""
        },
        {
            accessorKey: "type",
            header: translate("resources.accounts.fields.type"),
            cell: ({ row }) => data?.accountTypes?.[row.getValue("type") as any]?.type_descr || ""
        }
    ];

    const dataProvider = useDataProvider();

    if (listContext.isLoading || !listContext.data) {
        return <div>Loading...</div>;
    } else {
        return (
            <ListContextProvider value={listContext}>
                <DataTable columns={columns} data={listContext.data} />
            </ListContextProvider>
        );
    }
};
