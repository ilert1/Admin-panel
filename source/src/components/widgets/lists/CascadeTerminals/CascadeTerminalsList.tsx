import { useAbortableListController } from "@/hooks/useAbortableListController";
import { CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeTerminalsColumns } from "./Columns";
import { CreateCascadeTerminalsDialog } from "./CreateCascadeTerminalsDialog";
import { CascadeTerminalsListFilter } from "./CascadeTerminalsListFilter";

export const CascadeTerminalsList = () => {
    const listContext = useAbortableListController<CascadeTerminalSchema>({
        resource: "cascade_terminals",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetCascadeTerminalsColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <CascadeTerminalsListFilter handleCreateClicked={handleCreateClicked} />

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}

            <CreateCascadeTerminalsDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </ListContextProvider>
    );
};
