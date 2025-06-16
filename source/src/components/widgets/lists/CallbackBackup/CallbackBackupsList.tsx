import { useAbortableListController } from "@/hooks/useAbortableListController";
// import { useGetFinancialInstitutionColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCallbackBackupColumns } from "./Columns";

export const CallbackBackupsList = () => {
    const listContext = useAbortableListController({ resource: "callback_backup" });
    console.log(listContext.data);

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetCallbackBackupColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                {/* <FinancialInstitutionsListFilter handleCreateClicked={handleCreateClicked} /> */}

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            {/* <CreateFinancialInstitutionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} /> */}
        </>
    );
};
