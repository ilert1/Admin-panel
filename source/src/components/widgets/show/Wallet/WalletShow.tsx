import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useState } from "react";
import { useShowController, useTranslate } from "react-admin";
import { DeleteWalletDialog } from "./DeleteWalletDialog";
import { EditWalletDialog } from "./EditWalletDialog";

interface WalletShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
    type?: string;
}

export const WalletShow = (props: WalletShowProps) => {
    const { id, type, onOpenChange } = props;
    const context = useShowController<Wallet>({ id });
    const translate = useTranslate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleEditClicked = () => {
        setEditDialogOpen(true);
    };

    if (context.isLoading || !context.record) return;

    if (type === "compact") {
        return (
            <div className="flex flex-col gap-6 px-[42px]">
                <div className="grid grid-cols-2 gap-y-4">
                    <TextField
                        label={translate("resources.manageWallets.fields.walletType")}
                        text={context.record.type}
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.walletAddress")}
                        text={context.record.address ?? ""}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.accountNumber")}
                        text={context.record.type === "linked" ? context.record.account_id : ""}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.merchantId")}
                        text={context.record.type === "external" ? context.record.account_id : ""}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.currency")}
                        text={context.record.currency}
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.internalId")}
                        text={context.record.id}
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.blockchain")}
                        text={context.record.blockchain}
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.contactType")}
                        text={context.record.network}
                    />
                    <TextField
                        label={translate("resources.manageWallets.fields.minRemaini")}
                        text={String(context.record.minimal_ballance_limit)}
                    />
                    <div className="col-span-2">
                        <TextField
                            label={translate("resources.manageWallets.fields.descr")}
                            text={context.record.description ?? ""}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 px-[42px]">
                    <Button onClick={() => handleEditClicked()} className="text-title-1">
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button
                        variant={"outline"}
                        className="border-[1px] border-neutral-50 text-neutral-50 bg-transparent"
                        onClick={() => handleDeleteClicked()}>
                        {translate("app.ui.actions.delete")}
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
    } else {
        return <></>;
    }
};
