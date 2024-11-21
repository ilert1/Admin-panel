import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { FilterBar } from "./FilterBar";
import { ShowWalletTransactionsDialog } from "./ShowWalletTransactionsDialog";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController(
        permissions === "admin" ? { resource: "transaction" } : { resource: "merchant/transaction" }
    );

    const { columns, chosenId, openShowClicked, setOpenShowClicked } = useGetWalletTransactionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <FilterBar />

                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowWalletTransactionsDialog id={chosenId} open={openShowClicked} onOpenChange={setOpenShowClicked} />
            </>
        );
    }
};
