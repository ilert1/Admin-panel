import { ListContextProvider, useListController, useTranslate, useRefresh } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { KeysModal } from "../../components/KeysModal";
import { DeleteProviderDialog } from "./DeleteProviderDialog";
import { useGetProvidersColumns } from "./Columns";
import { EditProviderDialog } from "./EditProviderDialog";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { CreateProviderDialog } from "./CreateProviderDialog";
import { ConfirmCreatingDialog } from "./ConfirmCreatingDialog";
import { ProviderWithId } from "@/data/providers";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";

export const ProvidersList = () => {
    const listContext = useListController<ProviderWithId>();
    const translate = useTranslate();
    const refresh = useRefresh();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleRefresh = () => {
        refresh();
    };
    const handleCreateClicked = () => {
        setCreateDialogOpen(true);
    };

    const {
        chosenId,
        dialogOpen,
        deleteDialogOpen,
        columns,
        editDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
        setDialogOpen,
        confirmKeysCreatingOpen,
        setConfirmKeysCreatingOpen
    } = useGetProvidersColumns();

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div>
                    <div className="flex justify-between">
                        <div className="flex w-full justify-between mb-6">
                            <ResourceHeaderTitle />

                            <Button onClick={handleCreateClicked} variant="default" className="flex gap-[4px]">
                                <CirclePlus className="w-[16px] h-[16px]" />
                                <span className="text-title-1">{translate("resources.provider.createNew")}</span>
                            </Button>
                        </div>
                        <ConfirmCreatingDialog
                            open={confirmKeysCreatingOpen}
                            onOpenChange={setConfirmKeysCreatingOpen}
                            setConfirmed={setDialogOpen}
                        />

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
                            name={chosenId}
                            refresh={handleRefresh}
                        />
                    </div>
                </div>

                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
            </>
        );
    }
};
