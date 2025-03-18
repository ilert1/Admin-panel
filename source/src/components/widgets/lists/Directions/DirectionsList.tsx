import { ListContextProvider, useListController } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import {} from "react-responsive";
import { Loading } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const DirectionsList = () => {
    const listContext = useListController<Direction>();

    const { columns } = useGetDirectionsColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between">
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
