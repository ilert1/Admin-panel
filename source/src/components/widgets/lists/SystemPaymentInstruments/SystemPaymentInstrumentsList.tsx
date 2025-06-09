import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetSystemPaymentInstrumentsColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateSystemPaymentInstrumentDialog } from "./CreateSystemPaymentInstrumentDialog";
import { DeleteSystemPaymentInstrumentDialog } from "./DeleteSystemPaymentInstrumentDialog";
import { SystemPaymentInstrumentsListFilter } from "./SystemPaymentInstrumentsListFilter";

export const SystemPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({ resource: "systemPaymentInstruments" });
    const { columns, createDialogOpen, setCreateDialogOpen, showDeleteDialogOpen, setShowDeleteDialogOpen, chosenId } =
        useGetSystemPaymentInstrumentsColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <SystemPaymentInstrumentsListFilter handleCreateClicked={handleCreateClicked} />

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <CreateSystemPaymentInstrumentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
            <DeleteSystemPaymentInstrumentDialog
                open={showDeleteDialogOpen}
                onOpenChange={setShowDeleteDialogOpen}
                deleteId={chosenId}
            />
        </>
    );
};
