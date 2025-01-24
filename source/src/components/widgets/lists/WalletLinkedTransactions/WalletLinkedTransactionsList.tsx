import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletManualReconciliationBar } from "./WalletManualReconciliationBar";
import { useGetWalletLinkedTransactionColumns } from "./Columns";
import { ShowWalletLinkedTransactionsSheet } from "./ShowWalletLinkedTransactionsSheet";

export const WalletLinkedTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController<Wallets.WalletLinkedTransactions>(
        permissions === "admin" ? { resource: "reconciliation" } : { resource: "merchant/reconciliation" }
    );

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetWalletLinkedTransactionColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <WalletManualReconciliationBar />

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowWalletLinkedTransactionsSheet id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
