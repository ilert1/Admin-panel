import { useAbortableListController } from "@/hooks/useAbortableListController";
import { CascadeTerminalSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ListContextProvider, useTranslate } from "react-admin";
import { LoadingBlock } from "@/components/ui/loading";
import { DataTable } from "../../shared";
import { useGetCascadeTerminalsColumns } from "./Columns";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { Button } from "@/components/ui/Button";
import { CirclePlus } from "lucide-react";

export const CascadeTerminalsList = () => {
    const translate = useTranslate();
    const listContext = useAbortableListController<CascadeTerminalSchema>({
        resource: "cascade_terminals",
        sort: { field: "created_at", order: "DESC" }
    });

    const { columns, setCreateDialogOpen } = useGetCascadeTerminalsColumns();

    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    return (
        <ListContextProvider value={listContext}>
            <div className="mb-6 flex flex-wrap justify-between gap-2">
                <ResourceHeaderTitle />
                <div className="flex flex-wrap justify-end gap-2">
                    <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                        <CirclePlus className="h-[16px] w-[16px]" />

                        <span className="text-title-1">
                            {translate("resources.cascadeSettings.cascadeTerminals.createNew")}
                        </span>
                    </Button>
                </div>
            </div>

            {listContext.isLoading ? <LoadingBlock /> : <DataTable columns={columns} />}
        </ListContextProvider>
    );
};
