import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { useGetAccountsColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { AccountListFilter } from "./AccountListFilter";
import { EditAccountDialog } from "./EditAccountDialog";

export const AccountList = () => {
    const listContext = useAbortableListController<Account>();

    const { columns, showEditDialog, setShowEditDialog, showAccountId, isLoadingCurrencies, isLoadingMerchants } =
        useGetAccountsColumns();

    if (listContext.isLoading) return <Loading />;

    return (
        <>
            <ListContextProvider value={{ ...listContext }}>
                <div className="mb-4 mt-5">
                    <AccountListFilter
                    // setFilters={listContext.setFilters}
                    />
                </div>

                {listContext.isLoading || !listContext.data || isLoadingCurrencies || isLoadingMerchants ? (
                    <LoadingBlock />
                ) : (
                    <DataTable columns={columns} />
                )}
            </ListContextProvider>

            <EditAccountDialog id={showAccountId} open={showEditDialog} onOpenChange={setShowEditDialog} />
        </>
    );
};
