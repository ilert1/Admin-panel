import { ListContextProvider, useListController } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { UserListFilter } from "./UserListFilter";
import { useGetUserColumns } from "./Columns";

export const UserList = () => {
    const listContext = useListController<Users.User>();

    const { columns } = useGetUserColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <UserListFilter />

                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
