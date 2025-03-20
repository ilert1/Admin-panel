import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useLocaleState, usePermissions, useTranslate } from "react-admin";

interface WalletTransactionsShowProps {
    id: string;
}
export const WalletTransactionsShow = ({ id }: WalletTransactionsShowProps) => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const dictionaries = fetchDictionaries();
    const [locale] = useLocaleState();

    const context = useAbortableShowController<Wallets.Cryptotransactions>({
        resource: permissions === "admin" ? "transaction" : "merchant/transaction",
        id,
        queryOptions: {
            refetchInterval: 10000
        }
    });

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-4 px-4 md:gap-6 md:px-[42px]">
                <div className="flex grid-cols-2 flex-col gap-y-2 sm:grid sm:gap-y-4">
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
                        label={translate("resources.wallet.transactions.fields.clickOnHashlink")}
                        text={context.record?.tx_id}
                        link={context.record?.tx_link}
                        type={context.record?.tx_id ? "link" : "text"}
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
