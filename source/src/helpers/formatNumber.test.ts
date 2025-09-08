import { formatValue, formatNumber } from "./formatNumber";
import { Currency } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

describe("formatValue", () => {
    it("returns '0' for zero value", () => {
        expect(formatValue(0, 1, 2)).toBe("0");
    });

    it("formats value with fixed decimals", () => {
        expect(formatValue(123456, 1000, 2)).toBe("123.46");
    });

    it("adds thousand separators", () => {
        expect(formatValue(123456789, 1, 2)).toBe("123 456 789.00");
    });

    it("formats value without decimal part if fixTo is 0", () => {
        expect(formatValue(1234, 1, 0)).toBe("1 234");
    });
});

describe("formatNumber", () => {
    const currencies: Currency[] = [
        { code: "USD", accuracy: 2, is_coin: true },
        { code: "JPY", accuracy: 0, is_coin: true }
    ];

    const baseAmount: AccountBalance = {
        value: { quantity: 123456, accuracy: 1000 },
        holds: { quantity: 2000, accuracy: 1000 },
        currency: "USD"
    };

    it("formats value with currency", () => {
        const result = formatNumber(currencies, baseAmount);
        expect(result).toStrictEqual({ balance: "123.46 USD", holds: "2.00 USD" });
    });

    it("formats value without currency", () => {
        const result = formatNumber(currencies, baseAmount, true);
        expect(result).toStrictEqual({ balance: "123.46", holds: "2.00 USD" });
    });

    it("uses default fixTo=2 when currencies not provided", () => {
        const result = formatNumber(undefined, baseAmount);
        expect(result).toStrictEqual({ balance: "123.46 USD", holds: "2.00 USD" });
    });

    it("formats holds if present", () => {
        const amountWithHolds = {
            value: { quantity: 123456, accuracy: 1000 },
            holds: { quantity: 2000, accuracy: 1000 },
            currency: "USD"
        };

        const result = formatNumber(currencies, amountWithHolds);
        expect(result).toStrictEqual({ balance: "123.46 USD", holds: "2.00 USD" });
    });

    it("uses currency accuracy when specified", () => {
        const amountJPY = {
            value: { quantity: 123456, accuracy: 1 },
            holds: { quantity: 2000, accuracy: 1000 },
            currency: "JPY"
        };
        const result = formatNumber(currencies, amountJPY);
        expect(result).toStrictEqual({ balance: "123 456 JPY", holds: "2 JPY" });
    });
});
