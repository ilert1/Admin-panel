import { ListContextProvider, useListController, useShowController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useGetAccountShowColumns } from "./Columns";
import { useEffect, useState } from "react";
import { ShowTransactionSheet } from "../../lists/Transactions/ShowTransactionSheet";
import { uniqueId } from "lodash";
import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface AccountShowProps {
    id: string;
}

export const AccountShow = ({ id }: AccountShowProps) => {
    const translate = useTranslate();

    const context = useShowController({ resource: "accounts", id });

    const { isLoading: isLoadingCurrencies, data: currencies } = useListController({
        resource: "currency",
        perPage: 100000,
        disableSyncWithLocation: true
    });

    const { historyColumns, chosenId, transcationInfoOpen, setTransactionInfoOpen } = useGetAccountShowColumns();
    const [balances, setBalances] = useState<string[]>([]);

    const listContext = useListController<AccountHistory>({
        resource: "operations",
        filter: { accountId: id },
        disableSyncWithLocation: true
    });

    useEffect(() => {
        if (!context.isLoading && !isLoadingCurrencies && context.record.amounts[0]) {
            setBalances(
                context.record.amounts.map(
                    (el: { value: { quantity: number; accuracy: number }; currency: string }) => {
                        const currency = currencies.find((cur: Currency) => cur.code === el.currency);

                        const number =
                            el.value.quantity == 0
                                ? "0"
                                : (el.value.quantity / el.value.accuracy).toFixed(currency.accuracy);

                        const [intPart, decimalPart] = number.split(".");

                        const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        const formattedNumber = decimalPart ? `${formattedIntPart}.${decimalPart}` : formattedIntPart;

                        return formattedNumber + " " + el.currency;
                    }
                )
            );
        } else {
            setBalances(["0"]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.isLoading, isLoadingCurrencies]);

    useEffect(() => {
        if (chosenId) {
            setTransactionInfoOpen(true);
        }
    }, [chosenId, setTransactionInfoOpen]);

    if (context.isLoading || !context.record || listContext.isLoading || !listContext.data) {
        return <LoadingBlock />;
    }

    return (
        <div className="flex flex-col mx-6 h-full min-h-[300px]">
            <div className="flex sm:flex-row flex-col justify-between gap-4 mb-6 px-[20px]">
                <div className="flex flex-col gap-4">
                    <div className="text-display-2 text-neutral-90 dark:text-neutral-30">
                        <span>{context.record.meta.caption}</span>
                    </div>
                    <TextField text={id} copyValue className="text-neutral-90 dark:text-neutral-30" />
                </div>
                <div className="flex flex-wrap justify-end content-end gap-2">
                    {balances.length > 0 &&
                        balances.map(balance => (
                            <div className="bg-green-50 px-3 py-0.5 rounded-20" key={uniqueId()}>
                                <span className="text-title-2">
                                    {translate("resources.accounts.balance")}: {balance}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
            <ShowTransactionSheet id={chosenId} open={transcationInfoOpen} onOpenChange={setTransactionInfoOpen} />

            <ListContextProvider value={{ ...listContext }}>
                <DataTable columns={historyColumns} />
            </ListContextProvider>
        </div>
    );
};
