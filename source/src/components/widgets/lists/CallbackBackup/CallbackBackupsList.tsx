import { useAbortableListController } from "@/hooks/useAbortableListController";
// import { useGetFinancialInstitutionColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCallbackBackupColumns } from "./Columns";
import { CallbackBackupListFilter } from "./CallbackBackupListFilter";

export const CallbackBackupsList = () => {
    const listContext = useAbortableListController({ resource: "callback_backup" });
    const { columns } = useGetCallbackBackupColumns();

    // const handleCreateClicked = () => {
    //     setCreateDialogOpen(true);
    // };

    return (
        <>
            <ListContextProvider value={listContext}>
                <CallbackBackupListFilter />

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            {/* <CreateFinancialInstitutionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} /> */}
        </>
    );
};
