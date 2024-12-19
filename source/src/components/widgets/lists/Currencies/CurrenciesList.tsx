import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useGetCurrencyColumns } from "./Columns";
import { CreateCurrencyDialog } from "./CreateCurrencyDialog";
import { EditCurrencyDialog } from "./EditCurrencyDialog";
import { DeleteCurrencyDialog } from "./DeleteCurrencyDialog";

export const CurrenciesList = () => {
    const listContext = useListController<Currencies.Currency>();
    const translate = useTranslate();

    const {
        columns,
        currencyId,
        showEditDialog,
        setShowEditDialog,
        showAddCurrencyDialog,
        setShowAddCurrencyDialog,
        showDeleteDialog,
        setShowDeleteDialog
    } = useGetCurrencyColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button
                        onClick={() => setShowAddCurrencyDialog(true)}
                        className="flex items-center justify-center gap-1 font-normal">
                        <CirclePlus width={16} height={16} />
                        <span>{translate("resources.currency.create")}</span>
                    </Button>
                </div>

                <CreateCurrencyDialog open={showAddCurrencyDialog} onOpenChange={setShowAddCurrencyDialog} />

                <EditCurrencyDialog id={currencyId} open={showEditDialog} onOpenChange={setShowEditDialog} />

                <DeleteCurrencyDialog id={currencyId} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
            </>
        );
    }
};
