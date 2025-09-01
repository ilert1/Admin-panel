import { useAbortableListController } from "@/hooks/useAbortableListController";
import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeColumns } from "./Columns";
import { CascadesListFilter } from "./CascadesListFilter";
import { CreateCascadeDialog } from "./CreateCascadeDialog";

export const CascadesList = () => {
    const listContext = useAbortableListController<CascadeSchema>({
        resource: "cascades",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, createDialogOpen, setCreateDialogOpen } = useGetCascadeColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <CascadesListFilter handleCreateClicked={handleCreateClicked} />

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}

            <CreateCascadeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        </ListContextProvider>
    );
};
