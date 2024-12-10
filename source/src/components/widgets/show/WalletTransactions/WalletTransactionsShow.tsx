import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useLocaleState, usePermissions, useShowController, useTranslate } from "react-admin";

interface WalletTransactionsShowProps {
    id: string;
}
export const WalletTransactionsShow = ({ id }: WalletTransactionsShowProps) => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const dictionaries = fetchDictionaries();
    const [locale] = useLocaleState();

    const context = useShowController<Cryptotransactions>({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction",
        id,
        queryOptions: {
            refetchInterval: 10000
        }
    });

    // console.log(context?.record);

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-6 px-[42px]">
                <div className="flex flex-col sm:grid grid-cols-2 gap-y-4">
                    <TextField
                        label={translate("resources.wallet.transactions.fields.created_at")}
                        text={new Date(context.record?.created_at).toLocaleString(locale)}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.updated_at")}
                        text={new Date(context.record?.updated_at).toLocaleString(locale)}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.src_wallet")}
                        text={context.record?.src_wallet}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.dst_wallet")}
                        text={context.record?.dst_wallet}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.amount")}
                        text={String(context.record?.amount_quantity / context.record?.amount_accuracy)}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.currency")}
                        text={context.record?.currency}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.state")}
                        text={translate(
                            `resources.transactions.states.${dictionaries?.states?.[
                                context.record?.state
                            ]?.state_description?.toLowerCase()}`
                        )}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.type")}
                        text={dictionaries?.transactionTypes?.[context.record?.type]?.type_descr || ""}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.merchant_id")}
                        text={context.record?.merchant_id}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.tx_id")}
                        text={context.record?.tx_id}
                        copyValue
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.total_fee")}
                        text={context.record?.total_fee >= 0 ? String(context.record?.total_fee) : ""}
                    />
                    <TextField
                        label={translate("resources.wallet.transactions.fields.pre_calculated_fee")}
                        text={context.record?.pre_calculated_fee >= 0 ? String(context.record?.pre_calculated_fee) : ""}
                    />
                </div>
            </div>
        );
    }
};
