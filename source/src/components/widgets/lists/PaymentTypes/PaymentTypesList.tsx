import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetPaymentTypesColumns } from "./Columns";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { DeletePaymentTypeDialog } from "./DeletePaymentTypeDialog";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { CreatePaymentDialog } from "./CreatePaymentDialog";
import { EditPaymentDialog } from "./EditPaymentDialog";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const PaymentTypesList = () => {
    const translate = useTranslate();
    const listContext = useAbortableListController({ resource: "payment_type" });

    const {
        columns,
        deleteDialogOpen,
        chosenId,
        setDeleteDialogOpen,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen
    } = useGetPaymentTypesColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <ResourceHeaderTitle />

                    <div className="flex justify-end">
                        <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate("resources.paymentTools.paymentType.createNew")}
                            </span>
                        </Button>
                    </div>
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <DeletePaymentTypeDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} deleteId={chosenId} />

            <CreatePaymentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            <EditPaymentDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} id={chosenId} />
        </>
    );
};
