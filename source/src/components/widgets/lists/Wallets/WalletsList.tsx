import { ListContextProvider, useDataProvider, useListController, usePermissions, useTranslate } from "react-admin";
import { useGetWalletsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { useState } from "react";
import { DataTable } from "../../shared";
import { ShowWalletDialog } from "./ShowWalletDialog";
import { VaultDataProvider } from "@/data";
import { useQuery } from "react-query";

export const WalletsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController(
        permissions === "admin" ? { resource: "wallet" } : { resource: "merchant/wallet" }
    );
    const translate = useTranslate();

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetWalletsColumns();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const dataProvider = useDataProvider<VaultDataProvider>();
    const { data: storageState } = useQuery(["walletStorage"], () => dataProvider.getVaultState("vault"), {
        enabled: permissions === "admin"
    });

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-end justify-end mb-4">
                    <Button
                        onClick={handleCreateClick}
                        variant="default"
                        className="flex gap-[4px] items-center"
                        disabled={
                            permissions === "admin" && (!storageState?.initiated || storageState?.state === "sealed")
                        }>
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.wallet.manage.createWallet")}</span>
                    </Button>
                    <CreateWalletDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <ShowWalletDialog id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
