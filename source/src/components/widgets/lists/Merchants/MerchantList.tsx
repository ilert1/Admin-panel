import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useGetMerchantColumns } from "./Columns";
import { DeleteMerchantDialog } from "./DeleteMerchantDialog";
import { MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { MerchantListFilter } from "./MerchantListFilter";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const MerchantList = () => {
    const listContext = useAbortableListController<MerchantSchema>({
        resource: "merchant",
        sort: {
            field: "name",
            order: "ASC"
        }
    });

    const { columns, chosenId, deleteDialogOpen, setDeleteDialogOpen } = useGetMerchantColumns({ listContext });

    return (
        <>
            <ListContextProvider value={listContext}>
                <SyncDisplayedFilters />

                <MerchantListFilter />

                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <DeleteMerchantDialog id={chosenId} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
};
