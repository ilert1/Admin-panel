import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetFinancialInstitutionColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateFinancialInstitutionDialog } from "./CreateFinancialInstitutionDialog";
import { FinancialInstitutionsListFilter } from "./FinancialInstitutionsListFilter";

export const FinancialInstitutionList = () => {
    const listContext = useAbortableListController({ resource: "financialInstitution" });

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetFinancialInstitutionColumns();
    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <FinancialInstitutionsListFilter handleCreateClicked={handleCreateClicked} />

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <CreateFinancialInstitutionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
