import { ListContextProvider, useListController, usePermissions } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletManualReconciliationBar } from "./WalletManualReconciliationBar";
import { useGetWalletLinkedTransactionColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const WalletLinkedTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController<Wallets.WalletLinkedTransactions>(
        permissions === "admin" ? { resource: "reconciliation" } : { resource: "merchant/reconciliation" }
    );

    const { columns } = useGetWalletLinkedTransactionColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-wrap gap-2 justify-between mb-6">
                    <ResourceHeaderTitle />

                    <WalletManualReconciliationBar />
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
            </>
        );
    }
};
