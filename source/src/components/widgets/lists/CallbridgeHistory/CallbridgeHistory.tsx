import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetCallbridgeHistory } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export const CallbackHistoryList = () => {
    const listContext = useAbortableListController<CallbackHistoryRead>({
        resource: "callbridge/v1/history",
        sort: { field: "created_at", order: "ASC" }
    });

    const { columns } = useGetCallbridgeHistory();

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
            </div>
            <ListContextProvider value={listContext}>
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>

            {/* <DeleteMerchantDialog id={chosenId} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} /> */}

            {/* <EditMerchantDialog id={chosenId} open={editDialogOpen} onOpenChange={setEditDialogOpen} /> */}
        </>
    );
};
