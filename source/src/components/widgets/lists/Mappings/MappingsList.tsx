import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetMappingsColumns } from "./Columns";
import { CreateMappingDialog } from "./CreateMappingDialog";
import { DeleteMappingDialog } from "./DeleteMappingDialog";
import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { MappingsListFilter } from "./MappingsListFilter";

export const MappingsList = () => {
    const listContext = useAbortableListController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping",
        sort: {
            field: "created_at",
            order: "DESC"
        }
    });

    const {
        columns,
        chosenId,
        createMappingClicked,
        deleteMappingClicked,
        setDeleteMappingClicked,
        setCreateMappingClicked
    } = useGetMappingsColumns();

    if (listContext.isLoading) {
        return <Loading />;
    }

    return (
        <>
            <MappingsListFilter setCreateMappingClicked={setCreateMappingClicked} setFilters={listContext.setFilters} />

            <ListContextProvider value={listContext}>
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <CreateMappingDialog open={createMappingClicked} onOpenChange={setCreateMappingClicked} />
            <DeleteMappingDialog
                deleteId={chosenId}
                open={deleteMappingClicked}
                onOpenChange={setDeleteMappingClicked}
            />
        </>
    );
};
