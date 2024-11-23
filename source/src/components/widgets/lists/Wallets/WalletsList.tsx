import {
    fetchUtils,
    ListContextProvider,
    useDataProvider,
    useListController,
    usePermissions,
    useTranslate
} from "react-admin";
import { useGetWalletsColumns } from "./Columns";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateWalletDialog } from "./CreateWalletDialog";
import { useEffect, useState } from "react";
import { DataTable } from "../../shared";
import { ShowWalletDialog } from "./ShowWalletDialog";
import { VaultDataProvider } from "@/data";
import { useQuery } from "react-query";

const API_URL = import.meta.env.VITE_WALLET_URL;

export const WalletsList = () => {
    const { permissions } = usePermissions();
    const listContext = useListController(
        permissions === "admin" ? { resource: "wallet" } : { resource: "merchant/wallet" }
    );
    const translate = useTranslate();
    console.log(listContext?.perPage);
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const dataProvider = useDataProvider<VaultDataProvider>();
    const { data: storageState } = useQuery(["walletStorage"], () => dataProvider.getVaultState("vault"), {
        enabled: permissions === "admin"
    });

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };
    const fetchBalances = async () => {
        if (!listContext.data) return;

        const balancesMap: Record<string, string> = {};

        const balancePromises = listContext.data.map(async wallet => {
            const url = `${API_URL}/${permissions === "admin" ? "" : "merchant/"}wallet/${wallet.id}/balance`;

            return fetchUtils
                .fetchJson(url, {
                    user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
                })
                .then(({ json }) => {
                    if (!json.success) {
                        throw new Error("Balance fetch failed");
                    }

                    balancesMap[wallet.id] =
                        wallet.currency === "USDT" ? String(json.data.usdt_amount) : String(json.data.trx_amount);
                })
                .catch(error => {
                    // console.error(`Error fetching balance for wallet ${wallet.id}:`, error);
                    balancesMap[wallet.id] = "-";
                });
        });

        await Promise.allSettled(balancePromises);

        setBalances(balancesMap);
    };
    useEffect(() => {
        if (listContext.data) {
            fetchBalances();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listContext.data]);

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetWalletsColumns(
        listContext.data ?? [],
        balances
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
