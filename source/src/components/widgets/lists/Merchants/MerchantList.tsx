import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

import { useGetMerchantColumns } from "./Columns";
import { DeleteMerchantDialog } from "./DeleteMerchantDialog";
import { EditMerchantDialog } from "./EditMerchantDialog";
import { ShowMerchantSheet } from "./ShowMerchantSheet";
// import { CreateMerchantDialog } from "./CreateMerchantDialog";
import { CreateMerchantDialogNewFlow } from "./CreateMerchantDialogNewFlow";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { PlusCircle } from "lucide-react";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const MerchantList = () => {
    const listContext = useListController<Merchant>();
    const translate = useTranslate();

    const {
        columns,
        chosenId,
        editDialogOpen,
        deleteDialogOpen,
        showSheetOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setShowSheetOpen
    } = useGetMerchantColumns();

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
                <div className="flex flex-end flex-wrap justify-between gap-3 mb-6">
                    <ResourceHeaderTitle />
                    {/* <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.merchant.createNew")}
                    </Button> */}

                    <Button onClick={() => setCreateDialogNewFlowOpen(true)} variant="default" className="flex gap-1">
                        <PlusCircle className="w-[16px] h-[16px]" />
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

                <ShowMerchantSheet id={chosenId} open={showSheetOpen} onOpenChange={setShowSheetOpen} />
            </>
        );
    }
};
