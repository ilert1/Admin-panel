import { ListContextProvider, usePermissions } from "react-admin";
import { useGetWalletTransactionsColumns } from "./Columns";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { WalletTransactionsFilter } from "./WalletTransactionsFilter";
import { ConfirmDialog } from "./ConfirmDialog";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const WalletTransactionsList = () => {
    const { permissions } = usePermissions();

    const listContext = useAbortableListController({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction",
        queryOptions: {
            refetchInterval: 10000
        }
    });

    const { columns, chosenId, confirmOpen, setConfirmOpen } = useGetWalletTransactionsColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <SyncDisplayedFilters />

                <WalletTransactionsFilter />

                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} id={chosenId} />
        </>
    );
};
