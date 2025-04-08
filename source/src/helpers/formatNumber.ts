import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const formatValue = (value: number, acc: number, fixTo: number) => {
    const num = value === 0 ? "0" : (value / acc).toFixed(fixTo);
    const [intPart, decimalPart] = num.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
};

export const formatNumber = (
    currencies: Currency[] | undefined,
    el: Amount | AccountBalance,
    withoutCurrency = false
) => {
    let fixTo = 2;
    if (currencies) {
        const currency = currencies.find((cur: Currency) => cur.code === el.currency);
        fixTo = currency?.accuracy ?? 2;
    }

    const formattedValue = formatValue(el.value.quantity, el.value.accuracy, fixTo);
    const formattedHolds =
        el.holds && el.holds.quantity !== 0 ? formatValue(el.holds.quantity, el.holds.accuracy, fixTo) : null;

    const result = withoutCurrency ? formattedValue : `${formattedValue} ${el.currency}`;

    return formattedHolds
        ? {
              balance: result,
              holds: `${formattedHolds} ${el.currency}`
          }
        : { balance: result };
};
