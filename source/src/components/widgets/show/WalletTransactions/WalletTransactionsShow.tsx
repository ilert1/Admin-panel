import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";

interface WalletTransactionsShowProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const WalletTransactionsShow = (props: WalletTransactionsShowProps) => {
    const { id, onOpenChange } = props;
    const translate = useTranslate();

    // interface Cryptotransactions {
    //     blowfish_id: string;
    //     id: string;
    //     src_wallet: string;
    //     dst_wallet: string;
    //     amount_quantity: number;
    //     amount_accuracy: number;
    //     currency: string;
    //     state: number | string;
    //     type: number | string;
    //     merchant_id: string;
    //     tx_id: string;
    //     tx_link: string;
    //     total_fee: number;
    //     bandwidth_fee: 0;
    //     created_at: string;
    //     updated_at: string;
    //     deleted_at: string;
    // }

    return (
        <div className="flex flex-col gap-6 px-[42px]">
            <div className="flex flex-col sm:grid grid-cols-2 gap-y-4">
                <TextField label={translate("resources.wallet.transactions.fields.created_at")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.updated_at")} text="AA" copyValue />
                <TextField label={translate("resources.wallet.transactions.fields.src_wallet")} text="AA" copyValue />
                <TextField label={translate("resources.wallet.transactions.fields.dst_wallet")} text="AA" copyValue />
                <TextField label={translate("resources.wallet.transactions.fields.amount")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.currency")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.state")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.type")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.merchant_id")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.tx_id")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.total_fee")} text="AA" />
                <TextField label={translate("resources.wallet.transactions.fields.bandwidth_fee")} text="AA" />
            </div>
        </div>
    );
};
