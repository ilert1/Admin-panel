import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useLocaleState, usePermissions, useShowController, useTranslate } from "react-admin";

export const WalletLinkedTransactionShow = ({ id }: { id: string }) => {
    const { permissions } = usePermissions();
    const [locale] = useLocaleState();
    const translate = useTranslate();

    const context = useShowController<Wallets.WalletLinkedTransactions>({
        resource: permissions === "admin" ? "reconciliation" : "merchant/reconciliation",
        id
    });

    if (context.isLoading || !context.record || !id) {
        return <LoadingBlock />;
    }

    return (
        <div className="flex-1" tabIndex={-1}>
            <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-[42px]">
                <TextField
                    text={context.record?.source_address}
                    copyValue
                    className="text-neutral-70 dark:text-neutral-30"
                />

                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-y-2 sm:gap-y-4">
                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.scannedAt")}
                        text={new Date(context.record?.scanned_at).toLocaleString(locale)}
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.blockTimestamp")}
                        text={new Date(context.record?.block_timestamp).toLocaleString(locale)}
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.sourceAddress")}
                        text={context.record?.source_address}
                        copyValue
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.destinationAddress")}
                        text={context.record?.destnation_address}
                        copyValue
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.amount")}
                        text={context.record?.amount}
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.currency")}
                        text={context.record?.currency}
                    />

                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.type")}
                        text={String(context.record?.type)}
                    />
                </div>
            </div>
        </div>
    );
};
