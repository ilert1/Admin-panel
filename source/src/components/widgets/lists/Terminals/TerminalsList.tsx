import { ListContextProvider } from "react-admin";
import { useState } from "react";
import { CreateTerminalDialog } from "./CreateTerminalDialog";
import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { TerminalsListFilter } from "./TerminalsListFilter";
import { useGetTerminalColumns } from "./Columns";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";

export const TerminalsList = () => {
    const listContext = useAbortableListController({
        resource: "terminals"
    });
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { columns, chosenId, chosenTerminalProvider, deleteDialogOpen, setDeleteDialogOpen } =
        useGetTerminalColumns();

    return (
        <ListContextProvider value={listContext}>
            <TerminalsListFilter onCreateDialogOpen={() => setCreateDialogOpen(true)} />

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}

            <CreateTerminalDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            <DeleteTerminalDialog
                provider={chosenTerminalProvider}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                deleteId={chosenId}
            />
        </ListContextProvider>
    );
};
