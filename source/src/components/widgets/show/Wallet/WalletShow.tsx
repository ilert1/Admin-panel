import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useMemo, useState } from "react";
import { useDataProvider, useGetList, usePermissions, useShowController, useTranslate } from "react-admin";
import { DeleteWalletDialog } from "./DeleteWalletDialog";
import { EditWalletDialog } from "./EditWalletDialog";
import { useQuery } from "react-query";
import { WalletsDataProvider } from "@/data";
import { LoadingBalance } from "@/components/ui/loading";

interface WalletShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const WalletShow = ({ id, onOpenChange }: WalletShowProps) => {
    const { permissions } = usePermissions();
    const context = useShowController<Wallets.Wallet>({
        resource: permissions === "admin" ? "wallet" : "merchant/wallet",
        id
    });
    const translate = useTranslate();
    const dataProvider = useDataProvider<WalletsDataProvider>();

    const { data: accountsData } = useGetList<Account>("accounts", {
        pagination: { perPage: 1000, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const currentAccount = useMemo(
        () => accountsData?.find(item => item.id === context.record?.account_id),
        [accountsData, context.record?.account_id]
    );

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const { data: walletBalance, isFetching: walletBalanceFetching } = useQuery<Wallets.WalletBalance>(
        ["walletBalance"],
        () => dataProvider.getWalletBalance(permissions === "admin" ? "wallet" : "merchant/wallet", id),
        {
            enabled: !!id
        }
    );

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = () => {
        setEditDialogOpen(true);
    };

    if (context.isLoading || !context.record) return;

    return (
        <div className="flex flex-col gap-6 px-[42px]">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-y-4">
                <TextField label={translate("resources.wallet.manage.fields.walletType")} text={context.record.type} />

                <div>
                    <small className="text-sm text-muted-foreground">
                        {translate("resources.wallet.manage.fields.balance")}
                    </small>

                    {!walletBalanceFetching ? (
                        <div className="flex flex-col items-left justify-center">
                            {walletBalance?.usdt_amount != 0 && (
                                <TextField text={`${walletBalance?.usdt_amount} USDT`} />
                            )}
                            {walletBalance?.trx_amount !== 0 && <TextField text={`${walletBalance?.trx_amount} TRX`} />}
                            {walletBalance?.usdt_amount === 0 && walletBalance?.trx_amount === 0 && (
                                <TextField text="" />
                            )}
                        </div>
                    ) : (
                        <LoadingBalance className="text-base w-[15px] h-[15px] overflow-hidden" />
                    )}
                </div>

                <TextField
                    label={translate("resources.wallet.manage.fields.walletAddress")}
                    text={context.record.address ?? ""}
                    copyValue
                />
                <TextField
                    label={translate("resources.wallet.manage.fields.accountNumber")}
                    text={context.record.account_id}
                    copyValue
                />
                <TextField
                    label={translate("resources.wallet.manage.fields.currency")}
                    text={context.record.currency}
                />
                {currentAccount && (
                    <TextField
                        label={translate("resources.wallet.manage.fields.merchantName")}
                        text={currentAccount.meta?.caption ? currentAccount.meta.caption : currentAccount.owner_id}
                    />
                )}
                <TextField label={translate("resources.wallet.manage.fields.internalId")} text={context.record.id} />
                <TextField
                    label={translate("resources.wallet.manage.fields.blockchain")}
                    text={context.record.blockchain}
                />
                <TextField
                    label={translate("resources.wallet.manage.fields.contactType")}
                    text={context.record.network}
                />
                <TextField
                    label={translate("resources.wallet.manage.fields.minRemaini")}
                    text={String(context.record.minimal_ballance_limit)}
                />
                <div className="col-span-2">
                    <TextField
                        type="text"
                        wrap={true}
                        lineClamp={false}
                        label={translate("resources.wallet.manage.fields.descr")}
                        text={context.record.description ?? ""}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 px-[21px] sm:px-[42px] mb-4">
                <Button variant={"outline_gray"} onClick={() => handleDeleteClicked()}>
                    {translate("resources.users.delete")}
                </Button>

                <Button onClick={handleEditClicked} className="text-title-1 text-white">
                    {translate("resources.users.edit")}
                </Button>
            </div>
            <DeleteWalletDialog
                id={id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onQuickShowOpenChange={onOpenChange}
            />
            <EditWalletDialog id={id} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </div>
    );
};
