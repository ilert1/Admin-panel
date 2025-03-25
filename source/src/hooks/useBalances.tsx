import { formatNumber } from "@/helpers/formatNumber";
import { useEffect, useState } from "react";
import { useGetCurrencies } from "./useGetCurrencies";

/**
 *
 * @param isLoading Loading state of parent component context
 */
export const useBalances = (isLoading: boolean, amounts: Amount[]) => {
    const { currencies, isLoadingCurrencies } = useGetCurrencies();
    const [balances, setBalances] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !isLoadingCurrencies && amounts[0]) {
            setBalances(amounts.map(el => formatNumber(currencies, el)));
        } else {
            setBalances(["0"]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isLoadingCurrencies]);

    return { currencies, isLoadingCurrencies, balances };
};
