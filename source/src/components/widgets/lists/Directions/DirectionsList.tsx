import { ListContextProvider } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import {} from "react-responsive";
import { Loading } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const DirectionsList = () => {
    const listContext = useAbortableListController<Direction>();

    const { columns } = useGetDirectionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
                    <ListContextProvider value={listContext}>
                        <DirectionListFilter />
                    </ListContextProvider>
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
            </>
        );
    }
};
