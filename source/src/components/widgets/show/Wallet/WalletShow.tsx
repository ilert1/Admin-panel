import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useState } from "react";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import { DeleteWalletDialog } from "./DeleteWalletDialog";
import { EditWalletDialog } from "./EditWalletDialog";
import { Loading, LoadingBalance, LoadingBlock } from "@/components/ui/loading";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useQuery } from "@tanstack/react-query";

interface WalletShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const WalletShow = ({ id, onOpenChange }: WalletShowProps) => {
    const { permissions } = usePermissions();
    const context = useAbortableShowController<Wallets.Wallet>({
        resource: permissions === "admin" ? "wallet" : "merchant/wallet",
        id
    });
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const { data: currentAccountData, isLoading: currentAccountDataLoading } = useQuery({
        queryKey: ["accounts", "WalletShow", context.record?.account_id],
        queryFn: async ({ signal }) =>
            await dataProvider.getOne<Account>("accounts", {
                id: context.record?.account_id ?? "",
                signal
            }),
        select: data => (data ? data?.data : ""),
        enabled: !!context.record?.account_id
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const { data: walletBalance, isFetching: walletBalanceFetching } = useQuery<Wallets.WalletBalance>({
        queryKey: ["walletBalance", id],
        queryFn: ({ signal }) =>
            dataProvider.getWalletBalance(permissions === "admin" ? "wallet" : "merchant/wallet", id, signal),
        enabled: !!id
    });

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = () => {
        setEditDialogOpen(true);
    };

    if (context.isLoading || !context.record) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-4 px-4 md:gap-6 md:px-[42px]">
            <div className="flex flex-col gap-y-2 sm:grid sm:grid-cols-2 sm:gap-y-4">
                <TextField label={translate("resources.wallet.manage.fields.walletType")} text={context.record.type} />

                <div>
                    <small className="text-sm text-neutral-60">
                        {translate("resources.wallet.manage.fields.balance")}
                    </small>

                    {!walletBalanceFetching ? (
                        <div className="items-left flex flex-col justify-center">
                            {walletBalance?.usdt_amount != 0 && (
                                <TextField text={`${walletBalance?.usdt_amount} USDT`} />
                            )}
                            {walletBalance?.trx_amount !== 0 && <TextField text={`${walletBalance?.trx_amount} TRX`} />}
                            {walletBalance?.usdt_amount === 0 && walletBalance?.trx_amount === 0 && (
                                <TextField text="" />
                            )}
                        </div>
                    ) : (
                        <LoadingBalance className="h-[15px] w-[15px] overflow-hidden text-base" />
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
                {!currentAccountDataLoading ? (
                    <TextField
                        label={translate("resources.wallet.manage.fields.merchantName")}
                        text={
                            currentAccountData
                                ? currentAccountData?.meta?.caption
                                    ? currentAccountData?.meta?.caption
                                    : currentAccountData?.owner_id
                                : ""
                        }
                    />
                ) : (
                    <div>
                        <LoadingBlock className="!h-4 !w-4" />
                    </div>
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

            <div className="mb-4 flex flex-col justify-end gap-2 px-0 sm:flex-row sm:px-[42px] md:gap-4">
                <Button onClick={handleEditClicked} className="text-title-1 text-white">
                    {translate("resources.users.edit")}
                </Button>
                <Button variant={"outline_gray"} onClick={() => handleDeleteClicked()}>
                    {translate("resources.users.delete")}
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
