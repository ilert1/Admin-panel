import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetCallbridgeHistory } from "./Columns";
import { CallbackHistoryRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { CallbridgeHistoryListFilter } from "./CallbridgeHistoryListFilter";

export const CallbackHistoryList = () => {
    const listContext = useAbortableListController<CallbackHistoryRead>({
        resource: "callbridge/v1/history",
        sort: { field: "created_at", order: "ASC" }
    });

    const { columns } = useGetCallbridgeHistory();

    if (listContext.isLoading) return <Loading />;

    return (
        <>
            <CallbridgeHistoryListFilter setFilters={listContext.setFilters} />
            <ListContextProvider value={listContext}>
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
