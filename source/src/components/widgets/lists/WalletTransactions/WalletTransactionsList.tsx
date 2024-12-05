import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletTransactionsFilter } from "./WalletTransactionsFilter";
import { ShowWalletTransactionsDialog } from "./ShowWalletTransactionsDialog";
import { ConfirmDialog } from "./ConfirmDialog";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();

    const listContext = useListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction",
        queryOptions: {
            refetchInterval: 10000
        }
    });

    const { columns, chosenId, openShowClicked, confirmOpen, setConfirmOpen, setOpenShowClicked } =
        useGetWalletTransactionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <WalletTransactionsFilter />

                    <DataTable columns={columns} />
                </ListContextProvider>
                <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} id={chosenId} />
                <ShowWalletTransactionsDialog id={chosenId} open={openShowClicked} onOpenChange={setOpenShowClicked} />
            </>
        );
    }
};
