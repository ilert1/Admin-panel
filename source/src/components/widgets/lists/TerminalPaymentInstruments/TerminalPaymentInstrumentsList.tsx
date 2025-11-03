import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { TerminalPaymentInstrumentFilter } from "./TerminalPaymentInstrumentFilter";
import { TerminalPaymentInstrument } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { DeleteTerminalPaymentInstrumentsDialog } from "./DeleteTerminalPaymentInstrumentsDialog";
import { DeleteSelectedTPIDialog } from "./DeleteSelectedTPIDialog";

export const TerminalPaymentInstrumentsList = () => {
    const translate = useTranslate();

    const listContext = useAbortableListController<TerminalPaymentInstrument>({
        resource: "terminalPaymentInstruments",
        sort: {
            field: "created_at",
            order: "ASC"
        }
    });

    const {
        columns,
        createDialogOpen,
        setCreateDialogOpen,
        showDeleteDialogOpen,
        setShowDeleteDialogOpen,
        chosenId,
        setChosenId,
        rowSelection,
        setRowSelection,
        hasSelectedRows,
        selectedRowIds,
        showDeleteSelectedDialog,
        setShowDeleteSelectedDialog
    } = useGetTerminalPaymentInstrumentsListColumns({
        listContext
    });

    const createFn = () => {
        setCreateDialogOpen(true);
    };

    const handleDeleteSelected = () => {
        setShowDeleteSelectedDialog(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <div>
                <TerminalPaymentInstrumentFilter
                    createFn={createFn}
                    hasSelectedRows={hasSelectedRows}
                    onDeleteSelected={handleDeleteSelected}
                />
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
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    getRowId={row => row.id}
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

            <DeleteSelectedTPIDialog
                open={showDeleteSelectedDialog}
                onOpenChange={state => {
                    setShowDeleteSelectedDialog(state);
                    if (!state) {
                        setRowSelection({});
                    }
                }}
                selectedIds={selectedRowIds}
            />
        </ListContextProvider>
    );
};
