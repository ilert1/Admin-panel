import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading } from "@/components/ui/loading";
import { useGetCurrencyColumns } from "./Columns";
import { EditCurrencyDialog } from "./EditCurrencyDialog";
import { DeleteCurrencyDialog } from "./DeleteCurrencyDialog";
import { CurrencyWithId } from "@/data/currencies";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { CurrenciesListFilter } from "./CurrenciesListFilter";

export const CurrenciesList = () => {
    const listContext = useAbortableListController<CurrencyWithId>({ resource: "currency" });

    const { columns, currencyId, showEditDialog, setShowEditDialog, showDeleteDialog, setShowDeleteDialog } =
        useGetCurrencyColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <ListContextProvider value={listContext}>
                    <CurrenciesListFilter />

                    <DataTable columns={columns} />
                </ListContextProvider>

                <EditCurrencyDialog id={currencyId} open={showEditDialog} onOpenChange={setShowEditDialog} />

                <DeleteCurrencyDialog id={currencyId} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
            </>
        );
    }
};
