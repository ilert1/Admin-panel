import { ListContextProvider, useListController } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { UserListFilter } from "./UserListFilter";
import { ShowUserSheet } from "./ShowUserSheet";
import { useGetUserColumns } from "./Columns";
import { ShowMerchantSheet } from "../Merchants/ShowMerchantSheet";

export const UserList = () => {
    const listContext = useListController<Users.User>();

    const { columns, userId, showOpen, chosenMerchantId, showMerchants, setShowMerchants, setShowOpen } =
        useGetUserColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <UserListFilter />

                    <DataTable columns={columns} />
                </ListContextProvider>
                <ShowMerchantSheet id={chosenMerchantId} open={showMerchants} onOpenChange={setShowMerchants} />

                <ShowUserSheet id={userId} open={showOpen} onOpenChange={setShowOpen} />
            </>
        );
    }
};
