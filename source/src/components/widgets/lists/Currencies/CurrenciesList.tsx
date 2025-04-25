import { ListContextProvider, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { useGetCurrencyColumns } from "./Columns";
import { CreateCurrencyDialog } from "./CreateCurrencyDialog";
import { EditCurrencyDialog } from "./EditCurrencyDialog";
import { DeleteCurrencyDialog } from "./DeleteCurrencyDialog";
import { CurrencyWithId } from "@/data/currencies";
import { ResourceHeaderTitle, TestEnvText } from "../../components/ResourceHeaderTitle";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const CurrenciesList = () => {
    const listContext = useAbortableListController<CurrencyWithId>();
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
                <TestEnvText />

                <div className="mb-6 flex flex-wrap justify-between gap-2">
                    <ResourceHeaderTitle />
                    <Button
                        onClick={() => setShowAddCurrencyDialog(true)}
                        className="flex items-center justify-center gap-1 font-normal">
                        <CirclePlus width={16} height={16} />
                        {translate("resources.currency.create")}
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
