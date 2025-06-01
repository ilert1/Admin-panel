import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetTerminalPaymentInstrumentsListColumns } from "./Columns";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CreateTerminalPaymentInstrumentsDialog } from "./CreateTerminalPaymentInstrumentsDialog";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";
import { TerminalPaymentInstrumentFilter } from "./TerminalPaymentInstrumentFilter";

export const TerminalPaymentInstrumentsList = () => {
    const listContext = useAbortableListController({
        resource: "terminalPaymentInstruments",
        disableSyncWithLocation: true
    });

    const { translate, columns, createDialogOpen, setCreateDialogOpen } = useGetTerminalPaymentInstrumentsListColumns({
        isFetching: listContext.isFetching
    });

    const [filterName, setFilterName] = useState("");
    const [terminalFilterId, setTerminalFilterId] = useState("");
    const [provider, setProvider] = useState("");

    useEffect(() => {
        if (terminalFilterId) {
            listContext.setFilters({
                terminalFilterId
            });
        } else if (provider) {
            listContext.setFilters({
                provider
            });
        }
    }, [terminalFilterId, listContext, provider]);
    console.log(listContext.total);

    return (
        <>
            <ListContextProvider value={listContext}>
                <div className="mb-4 flex justify-between">
                    <div className="flex w-full items-center justify-between">
                        <SyncDisplayedFilters />
                        <ResourceHeaderTitle />

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                variant="default"
                                className="flex gap-[4px]">
                                <CirclePlus className="h-[16px] w-[16px]" />

                                <span className="text-title-1">
                                    {translate(
                                        "resources.paymentTools.terminalPaymentInstruments.createTerminalPaymentInstrument"
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <TerminalPaymentInstrumentFilter
                        selectProvider={setProvider}
                        currentProvider={provider}
                        terminalFilterName={filterName}
                        termId={terminalFilterId}
                        onChangeTerminalFilter={setFilterName}
                        setTerminalFilterId={setTerminalFilterId}
                        total={listContext.total ?? 0}
                    />
                </div>

                {listContext.isLoading || !listContext.data ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <CreateTerminalPaymentInstrumentsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </>
    );
};
