import { useTranslate } from "react-admin";
import { CurrencyIcon } from "./CurrencyIcon";
import { NumericFormat } from "react-number-format";

interface IBalanceList {
    totalAmount: AccountBalance[] | undefined;
    isMerchant: boolean;
    totalLoading: boolean;
}

export const BalanceList = ({ totalAmount, isMerchant, totalLoading }: IBalanceList) => {
    const translate = useTranslate();

    return (
        <div className="mb-1 flex flex-col content-start items-center pl-4 pr-2">
            <span className="mb-1 mt-[0.5rem] self-start text-note-2 text-neutral-60">
                {!isMerchant
                    ? translate("app.ui.header.accurateAggregatorProfit")
                    : translate("app.ui.header.accurateBalance")}
            </span>

            <div className="flex max-h-[250px] w-full flex-col items-start gap-[2px] overflow-y-auto overflow-x-hidden pr-2">
                {!totalLoading && totalAmount
                    ? totalAmount.map(el => (
                          <div className="flex w-full items-center justify-between" key={el.currency}>
                              <h4 className="text-display-4 text-neutral-90 dark:text-white">
                                  <NumericFormat
                                      className="whitespace-nowrap"
                                      value={el.value.quantity / el.value.accuracy}
                                      displayType="text"
                                      thousandSeparator=" "
                                      decimalSeparator=","
                                  />
                              </h4>

                              <div className="flex justify-center">
                                  <CurrencyIcon name={el.currency} />
                              </div>
                          </div>
                      ))
                    : null}
            </div>
        </div>
    );
};
