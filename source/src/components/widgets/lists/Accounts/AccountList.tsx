import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useGetAccountsColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { AccountListFilter } from "./AccountListFilter";
import { EditAccountDialog } from "./EditAccountDialog";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const AccountList = () => {
    const listContext = useAbortableListController<Account>();

    const { columns, showEditDialog, setShowEditDialog, showAccountId, isLoadingCurrencies, isMerchantsLoading } =
        useGetAccountsColumns();

    return (
        <>
            <ListContextProvider value={{ ...listContext }}>
                <SyncDisplayedFilters />

                <div className="mb-4 mt-5">
                    <AccountListFilter />
                </div>

                {listContext.isLoading || !listContext.data || isLoadingCurrencies || isMerchantsLoading ? (
                    <LoadingBlock />
                ) : (
                    <DataTable columns={columns} />
                )}
            </ListContextProvider>

            <EditAccountDialog id={showAccountId} open={showEditDialog} onOpenChange={setShowEditDialog} />
        </>
    );
};
