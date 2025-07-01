import { ListContextProvider, useDataProvider, usePermissions, useTranslate } from "react-admin";
import { useGetWalletsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { useEffect, useState } from "react";
import { DataTable } from "../../shared";
import { VaultDataProvider, WalletsDataProvider } from "@/data";
import { ResourceHeaderTitle } from "../../components/ResourceHeaderTitle";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { useQuery } from "@tanstack/react-query";

export const WalletsList = () => {
    const { permissions } = usePermissions();
    const listContext = useAbortableListController<Wallets.Wallet>(
        permissions === "admin" ? { resource: "wallet" } : { resource: "merchant/wallet" }
    );
    const translate = useTranslate();
    const [balances, setBalances] = useState<Map<string, Wallets.WalletBalance>>();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const dataProvider = useDataProvider<typeof VaultDataProvider & typeof WalletsDataProvider>();
    const { data: storageState } = useQuery({
        queryKey: ["walletStorage"],
        queryFn: ({ signal }) => dataProvider.getVaultState("vault", signal),
        enabled: permissions === "admin"
    });

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const fetchBalances = async (signal: AbortSignal) => {
        if (!listContext.data) return;

        const tempBalancesMap: Map<string, Wallets.WalletBalance> = new Map();

        const balancePromises = listContext.data.map(async wallet => {
            return dataProvider
                .getWalletBalance(permissions === "admin" ? "wallet" : "merchant/wallet", wallet.id, signal)
                .then(data => {
                    if (data) {
                        tempBalancesMap.set(wallet.id, data);
                    }
                });
        });

        await Promise.allSettled(balancePromises);

        if (!signal.aborted) {
            setBalances(tempBalancesMap); // Обновляем состояние только если запросы не отменены
        }
    };

    useEffect(() => {
        const abortController = new AbortController();

        if (listContext.data) {
            fetchBalances(abortController.signal);
        }

        return () => abortController.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listContext.data]);

    const { columns } = useGetWalletsColumns(listContext.data ?? [], balances ?? new Map());

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="mb-6 flex flex-wrap justify-between gap-2">
                    <ResourceHeaderTitle />

                    <Button
                        onClick={handleCreateClick}
                        variant="default"
                        className="flex items-center gap-[4px]"
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
            </>
        );
    }
};
