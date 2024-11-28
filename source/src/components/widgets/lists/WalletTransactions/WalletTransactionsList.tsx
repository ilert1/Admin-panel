import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletTransactionsFilter } from "./WalletTransactionsFilter";
import { ShowWalletTransactionsDialog } from "./ShowWalletTransactionsDialog";
import { ConfirmDialog } from "./ConfirmDialog";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();
<<<<<<< HEAD
    const listContext = useListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction"
    });
=======
>>>>>>> ITDEVELOP-1893

    const listContext = useListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction"
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
<<<<<<< HEAD

=======
                <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} id={chosenId} />
>>>>>>> ITDEVELOP-1893
                <ShowWalletTransactionsDialog id={chosenId} open={openShowClicked} onOpenChange={setOpenShowClicked} />
            </>
        );
    }
};
