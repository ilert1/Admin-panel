import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { UserListFilter } from "./UserListFilter";
import { useGetUserColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const UserList = () => {
    const listContext = useAbortableListController<Users.User>();

    const { columns, isLoadingMerchants } = useGetUserColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <UserListFilter />

                {listContext.isLoading || isLoadingMerchants ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
