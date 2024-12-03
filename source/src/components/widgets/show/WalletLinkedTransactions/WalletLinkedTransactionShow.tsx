import { LoadingAlertDialog } from "@/components/ui/loading";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { XIcon } from "lucide-react";
import { usePermissions, useShowController, useTranslate } from "react-admin";

interface WalletLinkedTransactionShowProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

const WalletLinkedTransactionShowFields = ({ id }: { id: string }) => {
    const { permissions } = usePermissions();
    const translate = useTranslate();

    const context = useShowController<WalletLinkedTransactions & { id: string }>({
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
                        text={context.record?.scanned_at}
                    />
                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.blockTimestamp")}
                        text={context.record?.block_timestamp}
                    />
                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.sourceAddress")}
                        text={context.record?.source_address}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.wallet.linkedTransactions.fields.destnationAddress")}
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

export const WalletLinkedTransactionShow = ({ id, open, onOpenChange }: WalletLinkedTransactionShowProps) => {
    const translate = useTranslate();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="sm:max-w-[1015px] max-h-[calc(100dvh-84px)] h-full sm:h-[560px] w-full p-0 m-0 top-[84px] flex flex-col border-0 overflow-y-auto"
                tabIndex={-1}
                style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                close={false}>
                <div className="p-[42px] pb-[0px] flex-shrink-0">
                    <div>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="text-display-1">
                                {translate("resources.wallet.linkedTransactions.show")}
                            </SheetTitle>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                <XIcon className="h-[28px] w-[28px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <WalletLinkedTransactionShowFields id={id} />

                <SheetDescription></SheetDescription>
            </SheetContent>
        </Sheet>
    );
};
