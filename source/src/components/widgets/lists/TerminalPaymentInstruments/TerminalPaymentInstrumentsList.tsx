import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { TerminalPaymentInstrumentFilter } from "./TerminalPaymentInstrumentFilter";

export const TerminalPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({
        resource: "terminalPaymentInstruments"
    });

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetTerminalPaymentInstrumentsListColumns({
        isFetching: listContext.isFetching
    });

    const createFn = () => {
        setCreateDialogOpen(true);
    };

    return (
        <>
            <ListContextProvider value={listContext}>
                <div>
                    <TerminalPaymentInstrumentFilter
                        createFn={createFn}
                        // total={listContext.total ?? 0}
                        terminalPaymentTypes={listContext.data?.[0]?.terminal.payment_types ?? undefined}
                    />
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}

                <CreateTerminalPaymentInstrumentsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
            </ListContextProvider>
        </>
    );
};
