import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetPaymentTypesColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { DeletePaymentTypeDialog } from "./DeletePaymentTypeDialog";
import { CreatePaymentDialog } from "./CreatePaymentDialog";
import { EditPaymentDialog } from "./EditPaymentDialog";
import { PaymentTypesListFilter } from "./PaymentTypesListFilter";

export const PaymentTypesList = () => {
    const listContext = useAbortableListController({
        resource: "payment_type",
        sort: {
            field: "code",
            order: "ASC"
        }
    });

    const {
        columns,
        deleteDialogOpen,
        chosenId,
        createDialogOpen,
        editDialogOpen,
        setDeleteDialogOpen,
        setCreateDialogOpen,
        setEditDialogOpen
    } = useGetPaymentTypesColumns({ listContext });

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <PaymentTypesListFilter handleCreateClicked={handleCreateClicked} />

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}

                <DeletePaymentTypeDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    deleteId={chosenId}
                />

                <CreatePaymentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

                <EditPaymentDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={chosenId} />
            </ListContextProvider>
        </>
    );
};
