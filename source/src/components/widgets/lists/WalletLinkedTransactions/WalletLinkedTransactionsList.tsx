import { ListContextProvider, usePermissions } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletManualReconciliationBar } from "./WalletManualReconciliation";
import { useGetWalletLinkedTransactionColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const WalletLinkedTransactionsList = () => {
    const { permissions } = usePermissions();
    const listContext = useAbortableListController<Wallets.WalletLinkedTransactions>(
        permissions === "admin" ? { resource: "reconciliation" } : { resource: "merchant/reconciliation" }
    );

    const { columns } = useGetWalletLinkedTransactionColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="mb-6 flex flex-wrap justify-between gap-2">
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
