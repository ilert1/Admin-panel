import { formatNumber } from "@/helpers/formatNumber";
import { useEffect, useState } from "react";
import { useCurrenciesListWithoutPagination } from "@/hooks";

/**
 *
 * @param isLoading Loading state of parent component context
 */
export const useBalances = (isLoading: boolean, amounts: Amount[] | AccountBalance[] | undefined) => {
    const { currenciesData, isCurrenciesLoading } = useCurrenciesListWithoutPagination();
    const [balances, setBalances] = useState<string[]>([]);
    const [holds, setHolds] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !isCurrenciesLoading && amounts && amounts.length > 0 && amounts[0]) {
            amounts.forEach(el => {
                const amount = formatNumber(currenciesData, el);
                setBalances(prev => [...prev, amount.balance]);
                if (amount.holds) setHolds(prev => [...prev, amount.holds]);
            });
        } else {
            setBalances([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isCurrenciesLoading, currenciesData]);

    return { holds, balances };
};
