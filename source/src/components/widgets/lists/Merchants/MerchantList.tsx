import { ListContextProvider, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

import { useGetMerchantColumns } from "./Columns";
import { DeleteMerchantDialog } from "./DeleteMerchantDialog";
import { EditMerchantDialog } from "./EditMerchantDialog";
// import { CreateMerchantDialog } from "./CreateMerchantDialog";
import { CreateMerchantDialogNewFlow } from "./CreateMerchantDialogNewFlow";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { PlusCircle } from "lucide-react";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { useAbortableListController } from "@/hooks/useAbortableListController";

export const MerchantList = () => {
    const listContext = useAbortableListController<Merchant>();
    const translate = useTranslate();

    const { columns, chosenId, editDialogOpen, deleteDialogOpen, setEditDialogOpen, setDeleteDialogOpen } =
        useGetMerchantColumns();

    // const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createDialogNewFlowOpen, setCreateDialogNewFlowOpen] = useState(false);

    // const handleCreateClick = () => {
    //     setCreateDialogOpen(true);
    // };

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex-end mb-6 flex flex-wrap justify-between gap-3">
                    <ResourceHeaderTitle />
                    {/* <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.merchant.createNew")}
                    </Button> */}

                    <Button onClick={() => setCreateDialogNewFlowOpen(true)} variant="default" className="flex gap-1">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        {translate("resources.merchant.createNew")}
                    </Button>
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>

                {/* <CreateMerchantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} /> */}
                <CreateMerchantDialogNewFlow open={createDialogNewFlowOpen} onOpenChange={setCreateDialogNewFlowOpen} />

                <DeleteMerchantDialog id={chosenId} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />

                <EditMerchantDialog id={chosenId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
            </>
        );
    }
};
