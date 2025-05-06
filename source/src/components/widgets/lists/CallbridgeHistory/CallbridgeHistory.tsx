import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetCallbridgeHistory } from "./Columns";
import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { CallbridgeHistoryListFilter } from "./CallbridgeHistoryListFilter";
import { SyncDisplayedFilters } from "../../shared/SyncDisplayedFilters";

export const CallbackHistoryList = () => {
    const listContext = useAbortableListController<CallbackHistoryRead>({
        resource: "callbridge/v1/history",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns } = useGetCallbridgeHistory();

    return (
        <ListContextProvider value={listContext}>
            <SyncDisplayedFilters />

            <CallbridgeHistoryListFilter />

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
        </ListContextProvider>
    );
};
