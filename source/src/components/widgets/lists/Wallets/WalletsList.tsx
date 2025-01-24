import { ListContextProvider, useDataProvider, useListController, usePermissions, useTranslate } from "react-admin";
import { useGetWalletsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { useEffect, useState } from "react";
import { DataTable } from "../../shared";
import { ShowWalletDialog } from "./ShowWalletDialog";
import { VaultDataProvider, WalletsDataProvider } from "@/data";
import { useQuery } from "react-query";

export const WalletsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController<Wallets.Wallet>(
        permissions === "admin" ? { resource: "wallet" } : { resource: "merchant/wallet" }
    );
    const translate = useTranslate();
    // console.log(listContext?.perPage);
    const [balances, setBalances] = useState<Map<string, Wallets.WalletBalance>>();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const dataProvider = useDataProvider<VaultDataProvider & WalletsDataProvider>();
    const { data: storageState } = useQuery(["walletStorage"], () => dataProvider.getVaultState("vault"), {
        enabled: permissions === "admin"
    });

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const fetchBalances = async () => {
        if (!listContext.data) return;

        const tempBalancesMap: Map<string, Wallets.WalletBalance> = new Map();

        const balancePromises = listContext.data.map(async wallet => {
            return dataProvider
                .getWalletBalance(permissions === "admin" ? "wallet" : "merchant/wallet", wallet.id)
                .then(data => {
                    if (data) {
                        tempBalancesMap.set(wallet.id, data);
                    }
                });
        });

        await Promise.allSettled(balancePromises);
        setBalances(tempBalancesMap);
    };

    useEffect(() => {
        if (listContext.data) {
            fetchBalances();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listContext.data]);

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetWalletsColumns(
        listContext.data ?? [],
        balances ?? new Map()
    );

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
