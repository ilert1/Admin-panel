import { formatNumber } from "@/helpers/formatNumber";
import { useEffect, useState } from "react";
import { useGetCurrencies } from "./useGetCurrencies";

/**
 *
 * @param isLoading Loading state of parent component context
 */
export const useBalances = (isLoading: boolean, amounts: Amount[] | AccountBalance[] | undefined) => {
    const { currencies, isLoadingCurrencies } = useGetCurrencies();
    const [balances, setBalances] = useState<string[]>([]);
    const [holds, setHolds] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !isLoadingCurrencies && amounts && amounts.length > 0 && amounts[0]) {
            amounts.forEach(el => {
                const amount = formatNumber(currencies, el);
                setBalances(prev => [...prev, amount.balance]);
                if (amount.holds) setHolds(prev => [...prev, amount.holds]);
            });
        } else {
            setBalances([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isLoadingCurrencies]);

    return { currencies, holds, isLoadingCurrencies, balances };
};
