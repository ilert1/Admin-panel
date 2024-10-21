import { ListContextProvider, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

import { useGetMerchantsColumns } from "./Columns";
import { DeleteMerchantDialog } from "./DeleteMerchantDialog";
import { EditMerchantDialog } from "./EditMerchantDialog";

export const MerchantList = () => {
    const listContext = useListController<Merchant>();
    const translate = useTranslate();

    const { columns, chosenId, editDialogOpen, deleteDialogOpen, setEditDialogOpen, setDeleteDialogOpen } =
        useGetMerchantsColumns();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button onClick={handleCreateClick} variant="default">
                        {translate("resources.merchants.createNew")}
                    </Button>

                    {/* <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <AlertDialogContent className="min-w-[716px] bg-muted">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center">
                                    {translate("resources.merchants.createNew")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <MerchantCreate setOpen={setCreateDialogOpen} />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> */}
                    <DeleteMerchantDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} id={chosenId} />
                    <EditMerchantDialog id={chosenId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
            </>
        );
    }
};

//  <Sheet open={showOpen} onOpenChange={setShowOpen}>
// <SheetContent
//     className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
//     side={isMobile ? "bottom" : "right"}>
//     <ScrollArea className="h-full">
//         <SheetHeader className="mb-2">
//             <SheetTitle>{translate("resources.merchants.showTitle")}</SheetTitle>
//             <SheetDescription>
//                 {/* {translate("resources.currencies.showDescription", { id: showMerchantId })} */}
//             </SheetDescription>
//         </SheetHeader>
//         <MerchantShow id={showMerchantId} />
//     </ScrollArea>
// </SheetContent>
// </Sheet>
