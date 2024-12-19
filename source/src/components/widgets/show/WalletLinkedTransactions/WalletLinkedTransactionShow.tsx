import { LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useLocaleState, usePermissions, useShowController, useTranslate } from "react-admin";

export const WalletLinkedTransactionShow = ({ id }: { id: string }) => {
    const { permissions } = usePermissions();
    const [locale] = useLocaleState();
    const translate = useTranslate();

    const context = useShowController<WalletLinkedTransactions>({
        resource: permissions === "admin" ? "reconciliation" : "merchant/reconciliation",
        id
    });

    if (context.isLoading || !context.record || !id) {
        return <LoadingAlertDialog />;
    }

    return (
        <div className="flex-1" tabIndex={-1}>
            <div className="flex flex-col gap-6 px-[42px]">
                <TextField text={context.record?.source_address} copyValue />

                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-y-4">
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
