import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const formatNumber = (
    currencies: Currency[] | undefined,
    el: Amount | AccountBalance,
    withoutCurrency = false
) => {
    let accuracy = 2;
    if (currencies) {
        const currency = currencies.find((cur: Currency) => cur.code === el.currency);
        accuracy = currency?.accuracy ?? 2;
    }
    console.log(el);

    const formatValue = (value: number, acc: number) => {
        const num = value === 0 ? "0" : (value / acc).toFixed(accuracy);
        const [intPart, decimalPart] = num.split(".");
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
    };

    const formattedValue = formatValue(el.value.quantity, el.value.accuracy);
    const formattedHolds =
        el.holds && el.holds.quantity !== 0 ? formatValue(el.holds.quantity, el.holds.accuracy) : null;

    const result = withoutCurrency ? formattedValue : `${formattedValue} ${el.currency}`;

    return formattedHolds
        ? {
              balance: result,
              holds: `${formattedHolds} ${el.currency}`
          }
        : { balance: result };
};
