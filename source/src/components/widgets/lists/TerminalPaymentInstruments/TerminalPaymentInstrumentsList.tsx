import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";

export const TerminalPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({ resource: "terminalPaymentInstruments" });
    const { translate, columns, createDialogOpen, setCreateDialogOpen } = useGetTerminalPaymentInstrumentsListColumns({
        isFetching: listContext.isFetching
    });

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <ResourceHeaderTitle />

                    <div className="flex justify-end">
                        <Button onClick={() => setCreateDialogOpen(true)} variant="default" className="flex gap-[4px]">
                            <CirclePlus className="h-[16px] w-[16px]" />

                            <span className="text-title-1">
                                {translate(
                                    "resources.paymentTools.terminalPaymentInstruments.createTerminalPaymentInstrument"
                                )}
                            </span>
                        </Button>
                    </div>
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <CreateTerminalPaymentInstrumentsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
