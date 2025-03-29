import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useGetMerchantColumns } from "./Columns";
import { DeleteMerchantDialog } from "./DeleteMerchantDialog";
import { EditMerchantDialog } from "./EditMerchantDialog";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { MerchantListFilter } from "./MerchantListFilter";

export const MerchantList = () => {
    const listContext = useAbortableListController<Merchant>();

    const { columns, chosenId, editDialogOpen, deleteDialogOpen, setEditDialogOpen, setDeleteDialogOpen } =
        useGetMerchantColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <MerchantListFilter />
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            <DeleteMerchantDialog id={chosenId} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />

            <EditMerchantDialog id={chosenId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </>
    );
};
