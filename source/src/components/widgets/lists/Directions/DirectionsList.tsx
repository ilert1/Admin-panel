import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const DirectionsList = () => {
    const listContext = useAbortableListController<Direction>();

    const { columns } = useGetDirectionsColumns({ isFetching: listContext.isFetching });

    return (
        <>
            <ListContextProvider value={listContext}>
                <DirectionListFilter />
                {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
            </ListContextProvider>
        </>
    );
};
