import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { DeleteDirectionDialog } from "../../show/Direction/DeleteDirectionDialog";

export const DirectionsList = () => {
    const listContext = useAbortableListController<Direction>();

    const { columns, deleteDialogOpen, chosenId, setDeleteDialogOpen, onCloseSheet } = useGetDirectionsColumns();

    return (
        <>
            <ListContextProvider value={listContext}>
                <DirectionListFilter />
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
            <DeleteDirectionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onCloseSheet}
                id={chosenId}
            />
        </>
    );
};
