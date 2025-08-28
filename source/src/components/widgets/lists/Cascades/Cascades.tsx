import { useAbortableListController } from "@/hooks/useAbortableListController";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { CascadeSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeColumns } from "./Columns";

export const CascadesList = () => {
    const listContext = useAbortableListController<CascadeSchema>({
        resource: "cascades",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns } = useGetCascadeColumns();

    return (
        <ListContextProvider value={listContext}>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
            </div>

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
        </ListContextProvider>
    );
};
