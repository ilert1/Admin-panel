import { useAbortableListController } from "@/hooks/useAbortableListController";
import { MerchantCascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeMerchantColumns } from "./Columns";
import { CreateCascadeMerchantsDialog } from "./CreateCascadeMerchantDialog";
import { CascadeMerchantListFilter } from "./CascadeMerchantListFilter";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const CascadeMerchantsList = () => {
    const listContext = useAbortableListController<MerchantCascadeSchema>({
        resource: "cascadeSettings/cascadeMerchants",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, setCreateDialogOpen, createDialogOpen, isMerchantsLoading } = useGetCascadeMerchantColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <SyncDisplayedFilters />

            <CascadeMerchantListFilter handleCreateClicked={handleCreateClicked} />

            {listContext.isLoading || isMerchantsLoading ? (
                <LoadingBlock />
            ) : (
                <DataTable columns={columns} data={listContext.data} />
            )}

            <CreateCascadeMerchantsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </ListContextProvider>
    );
};
