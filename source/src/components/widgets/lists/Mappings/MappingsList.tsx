import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetMappingsColumns } from "./Columns";
import { MappingsHeader } from "./MappingsHeader";
import { CreateMappingDialog } from "./CreateMappingDialog";
import { DeleteMappingDialog } from "./DeleteMappingDialog";
import { CallbackMappingRead } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

export const MappingsList = () => {
    const listContext = useAbortableListController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping"
    });

    const {
        columns,
        chosenId,
        createMappingClicked,
        deleteMappingClicked,
        setDeleteMappingClicked,
        setCreateMappingClicked
    } = useGetMappingsColumns();

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <MappingsHeader setCreateMappingClicked={setCreateMappingClicked} />
            </div>
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
