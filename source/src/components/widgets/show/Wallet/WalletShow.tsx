import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { ShowContextProvider, useShowController, useTranslate } from "react-admin";

interface WalletShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
    type?: string;
}

// Раскомментировать и вставить в поля, и заработает

export const WalletShow = (props: WalletShowProps) => {
    const { id, type, onOpenChange } = props;
    // const context = useShowController<Wallet>({ id });
    const translate = useTranslate();

    /*
        context.record.type 
        context.record.address
        context.record.account_id
        context.record.account_id
        context.record.currency
        context.record.id
        context.record.blockchain
        context.record.network
        context.record.minimal_ballance_limit
        context.record.description
    */

    // if (context.isLoading) {
    //     return <Loading />;
    // }

    if (type === "compact") {
        return (
            <div className="flex flex-col gap-6 px-[42px]">
                <div className="grid grid-cols-2 gap-y-4">
                    <TextField label={translate("resources.manageWallets.fields.walletType")} text="AA" />
                    <TextField label={translate("resources.manageWallets.fields.walletAddress")} text="AA" copyValue />
                    <TextField label={translate("resources.manageWallets.fields.accountNumber")} text="AA" copyValue />
                    <TextField label={translate("resources.manageWallets.fields.merchantId")} text="AA" copyValue />
                    <TextField label={translate("resources.manageWallets.fields.currency")} text="AA" />
                    <TextField label={translate("resources.manageWallets.fields.internalId")} text="AA" />
                    <TextField label={translate("resources.manageWallets.fields.blockchain")} text="AA" />
                    <TextField label={translate("resources.manageWallets.fields.contactType")} text="AA" />
                    <TextField label={translate("resources.manageWallets.fields.minRemaini")} text="AA" />
                    <div className="col-span-2">
                        <TextField label={translate("resources.manageWallets.fields.descr")} text="AA" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 px-[42px]">
                    <Button onClick={() => {}} className="text-title-1">
                        {translate("app.ui.actions.edit")}
                    </Button>

                    <Button
                        variant={"outline"}
                        className="border-[1px] border-neutral-50 text-neutral-50 bg-transparent"
                        onClick={() => {}}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
    // return <ShowContextProvider value={context}></ShowContextProvider>;
};
