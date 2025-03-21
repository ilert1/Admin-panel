import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export const formatNumber = (currencies: Currency[], el: Amount | AccountBalance, withoutCurrency = false) => {
    let accuracy = 2;
    if (currencies) {
        const currency = currencies.find((cur: Currency) => cur.code === el.currency);
        accuracy = currency?.accuracy ?? 2;
    }

    const number = el.value.quantity == 0 ? "0" : (el.value.quantity / el.value.accuracy).toFixed(accuracy);

    const [intPart, decimalPart] = number.split(".");

    const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formattedNumber = decimalPart ? `${formattedIntPart}.${decimalPart}` : formattedIntPart;

    return withoutCurrency ? formattedNumber : formattedNumber + " " + el.currency;
};
