import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useGetMappingsColumns } from "./Columns";
import { CallbackMappingRead } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { MappingsHeader } from "./MappingsHeader";
import { CreateMappingDialog } from "./CreateMappingDialog";

export const MappingsList = () => {
    const listContext = useAbortableListController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping"
    });

    const { columns, createMappingClicked, setCreateMappingClicked } = useGetMappingsColumns();

    return (
        <>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <MappingsHeader setCreateMappingClicked={setCreateMappingClicked} />
            </div>
            <ListContextProvider value={listContext}>
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <CreateMappingDialog open={createMappingClicked} onOpenChange={setCreateMappingClicked} />
        </>
    );
};
