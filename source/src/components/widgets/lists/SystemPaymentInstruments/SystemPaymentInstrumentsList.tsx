import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetSystemPaymentInstrumentsColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateSystemPaymentInstrumentDialog } from "./CreateSystemPaymentInstrumentDialog";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useTranslate } from "react-admin";
import { DeleteSystemPaymentInstrumentDialog } from "./DeleteSystemPaymentInstrumentDialog";

export const SystemPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({ resource: "systemPaymentInstruments" });
    const translate = useTranslate();
    const { columns, createDialogOpen, setCreateDialogOpen, showDeleteDialogOpen, setShowDeleteDialogOpen, chosenId } =
        useGetSystemPaymentInstrumentsColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <ResourceHeaderTitle />
                    <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                        <CirclePlus className="h-[16px] w-[16px]" />

                        <span className="text-title-1">
                            {translate("resources.paymentTools.systemPaymentInstruments.createNew")}
                        </span>
                    </Button>
                </div>

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
