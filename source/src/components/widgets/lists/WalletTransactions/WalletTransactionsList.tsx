import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletTransactionsFilter } from "./WalletTransactionsFilter";
import { ShowWalletTransactionsDialog } from "./ShowWalletTransactionsDialog";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction"
    });

    const { columns, chosenId, openShowClicked, setOpenShowClicked } = useGetWalletTransactionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <WalletTransactionsFilter />

                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowWalletTransactionsDialog id={chosenId} open={openShowClicked} onOpenChange={setOpenShowClicked} />
            </>
        );
    }
};
