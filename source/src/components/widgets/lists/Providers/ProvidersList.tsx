import { ListContextProvider, useRefresh } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { KeysModal } from "../../components/KeysModal";
import { useGetProvidersColumns } from "./Columns";
import { ConfirmCreatingDialog } from "./ConfirmCreatingDialog";
import { IProvider } from "@/data/providers";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";
import { ProvidersListFilter } from "./ProvidersListFilter";

export const ProvidersList = () => {
    const listContext = useAbortableListController<IProvider>();
    const refresh = useRefresh();

    const handleRefresh = () => {
        refresh();
    };

    const {
        chosenId,
        dialogOpen,
        columns,
        confirmKeysCreatingOpen,
        chosenProviderName,
        setDialogOpen,
        setConfirmKeysCreatingOpen
    } = useGetProvidersColumns();

    return (
        <>
            <div>
                <div className="flex justify-between">
                    <ConfirmCreatingDialog
                        open={confirmKeysCreatingOpen}
                        onOpenChange={setConfirmKeysCreatingOpen}
                        setConfirmed={setDialogOpen}
                    />

                    <KeysModal
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        isTest={false}
                        name={chosenId}
                        refresh={handleRefresh}
                        providerName={chosenProviderName}
                    />
                </div>
            </div>

            <ListContextProvider value={listContext}>
                <SyncDisplayedFilters />

                <ProvidersListFilter />
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
