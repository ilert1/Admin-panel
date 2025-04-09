import { useTranslate } from "react-admin";
import { CurrencyIcon } from "./CurrencyIcon";
import { NumericFormat } from "react-number-format";
import { SnowflakeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IBalanceList {
    totalAmount: AccountBalance[] | undefined;
    isMerchant: boolean;
    totalLoading: boolean;
}

export const BalanceList = ({ totalAmount, isMerchant, totalLoading }: IBalanceList) => {
    const translate = useTranslate();

    return (
        <div className="mb-1 flex flex-col content-start items-center">
            <span className="mb-1 mt-[0.5rem] self-start pl-4 text-note-2 text-neutral-60">
                {!isMerchant
                    ? translate("app.ui.header.accurateAggregatorProfit")
                    : translate("app.ui.header.accurateBalance")}
            </span>
            <div
                className={`flex max-h-[250px] w-full flex-col items-start gap-[2px] overflow-y-auto overflow-x-hidden`}>
                {!totalLoading && totalAmount ? (
                    totalAmount.map((el, index) => (
                        <div
                            key={el.currency}
                            className={cn(
                                "flex w-full flex-col py-2 pl-4 pr-2",
                                index % 2 ? "dark:bg-neutral-bb" : "bg-neutral-20 dark:bg-neutral-100"
                            )}>
                            <div className="flex w-full items-center gap-2">
                                <h4 className="overflow-y-hidden text-neutral-90 dark:text-white">
                                    <NumericFormat
                                        className="whitespace-nowrap !text-display-4"
                                        value={el.value.quantity / el.value.accuracy}
                                        displayType={"text"}
                                        thousandSeparator=" "
                                        decimalSeparator="."
                                    />
                                </h4>
                                <div className="flex justify-center overflow-y-hidden">
                                    <CurrencyIcon name={el.currency} />
                                </div>
                            </div>
                            {el.holds && el.holds.quantity !== 0 && (
                                <div className="flex w-full items-center justify-between">
                                    <h4 className="flex items-center gap-1 overflow-y-hidden text-display-4 text-neutral-90 dark:text-white">
                                        <SnowflakeIcon className="h-5 w-5 text-extra-7" />
                                        <NumericFormat
                                            className="whitespace-nowrap !text-title-1 text-extra-7"
                                            value={(el.holds.quantity / el.holds.accuracy).toFixed(2)}
                                            displayType={"text"}
                                            thousandSeparator=" "
                                            decimalSeparator="."
                                        />
                                    </h4>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
