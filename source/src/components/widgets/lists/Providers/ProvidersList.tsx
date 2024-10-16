import { ListContextProvider, useListController, useTranslate, useRedirect, useRefresh } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "react-responsive";
import { Loading } from "@/components/ui/loading";
import { ProvidersShow } from "../../show/ProvidersShow";
import { KeysModal } from "../../components/KeysModal";
import { DeleteProviderDialog } from "./DeleteProviderDialog";
import { useGetProvidersColumns } from "./Columns";
import { EditProviderDialog } from "./EditProviderDialog";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { CreateProviderDialog } from "./CreateProviderDialog";

export const ProvidersList = () => {
    const listContext = useListController<Provider>();
    const translate = useTranslate();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleRefresh = () => {
        refresh();
    };
    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    const {
        chosenId,
        showProviderId,
        dialogOpen,
        deleteDialogOpen,
        showOpen,
        providerName,
        columns,
        editDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setShowOpen,
        setDialogOpen
    } = useGetProvidersColumns();

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div>
                    <div className="flex justify-end justify-between mb-4 mt-[24px]">
                        <div className="flex w-full justify-end">
                            <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                                <CirclePlus className="w-[16px] h-[16px]" />
                                <span className="text-title-1">{translate("resources.providers.createNew")}</span>
                            </Button>
                        </div>
                        <CreateProviderDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                        <EditProviderDialog id={chosenId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
                        <DeleteProviderDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                            deleteId={chosenId}
                        />
                        <KeysModal
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            isTest={false}
                            name={providerName}
                            refresh={handleRefresh}
                        />
                    </div>
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <Sheet open={showOpen} onOpenChange={setShowOpen}>
                    <SheetContent
                        className={isMobile ? "w-full h-4/5" : "max-w-[400px] sm:max-w-[540px]"}
                        side={isMobile ? "bottom" : "right"}>
                        <ScrollArea className="h-full">
                            <SheetHeader className="mb-2">
                                <SheetTitle>{translate("resources.providers.showTitle")}</SheetTitle>
                                <SheetDescription></SheetDescription>
                            </SheetHeader>
                            <ProvidersShow id={showProviderId} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
