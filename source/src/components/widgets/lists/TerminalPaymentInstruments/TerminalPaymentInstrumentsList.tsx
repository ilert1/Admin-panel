import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { TerminalPaymentInstrumentFilter } from "./TerminalPaymentInstrumentFilter";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { DeleteTerminalPaymentInstrumentsDialog } from "./DeleteTerminalPaymentInstrumentsDialog";

export const TerminalPaymentInstrumentsList = () => {
    const translate = useTranslate();

    const listContext = useAbortableListController<TerminalPaymentInstrument>({
        resource: "terminalPaymentInstruments"
    });

    const {
        columns,
        createDialogOpen,
        setCreateDialogOpen,
        showDeleteDialogOpen,
        setShowDeleteDialogOpen,
        chosenId,
        setChosenId
    } = useGetTerminalPaymentInstrumentsListColumns({
        listContext
    });

    const createFn = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <div>
                <TerminalPaymentInstrumentFilter createFn={createFn} />
            </div>

            {listContext.isLoading ? (
                <LoadingBlock />
            ) : (
                <DataTable
                    columns={columns}
                    placeholder={
                        !listContext.filterValues?.["provider"]
                            ? translate("resources.paymentSettings.terminalPaymentInstruments.providerNotSelect")
                            : undefined
                    }
                />
            )}

            <CreateTerminalPaymentInstrumentsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            <DeleteTerminalPaymentInstrumentsDialog
                open={showDeleteDialogOpen}
                onOpenChange={setShowDeleteDialogOpen}
                onQuickShowOpenChange={state => {
                    if (!state) {
                        setChosenId("");
                    }

                    setShowDeleteDialogOpen(state);
                }}
                id={chosenId}
            />
        </ListContextProvider>
    );
};
