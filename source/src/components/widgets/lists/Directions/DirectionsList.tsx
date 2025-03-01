import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import {} from "react-responsive";
import { Loading } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { PlusCircle } from "lucide-react";
import { ShowDirectionSheet } from "./ShowDirectionSheet";
import { CreateDirectionDialog } from "./CreateDirectionDialog";
import { DirectionListFilter } from "./DirectionListFilter";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const DirectionsList = () => {
    const listContext = useListController<Direction>();

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
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-4">
                    <ListContextProvider value={listContext}>
                        <DirectionListFilter />
                    </ListContextProvider>

                    <Button onClick={handleCreateClick} variant="default" className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.direction.create")}</span>
                    </Button>

                    <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                <ShowDirectionSheet id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
