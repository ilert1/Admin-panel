import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {} from "react-responsive";
import { Loading } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { PlusCircle } from "lucide-react";
import { ShowSheet } from "./ShowSheet";
import { CreateDirectionDialog } from "./CreateDirectionDialog";

export const DirectionsList = () => {
    const listContext = useListController<Directions.Direction>();

    const translate = useTranslate();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetDirectionsColumns();

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default" className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.direction.create")}</span>
                    </Button>
                    <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <ShowSheet id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
