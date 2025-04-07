import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/helpers/formatNumber";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { useEffect, useState } from "react";
import { CurrencyIcon } from "./CurrencyIcon";
import { UserIdentity, useTranslate } from "react-admin";

interface IBalanceDisplay {
    totalAmount: AccountBalance[] | undefined;
    isMerchant: boolean;
    identity: UserIdentity | undefined;
    totalLoading: boolean;
}

export const BalanceDisplay = ({ totalAmount, isMerchant, identity, totalLoading }: IBalanceDisplay) => {
    const translate = useTranslate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (totalAmount && totalAmount.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % totalAmount.length);
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [totalAmount]);

    return (
        <div className="flex min-w-[137px] flex-col items-start gap-[2px]">
            <span className="text-title-2 text-neutral-90 dark:text-neutral-0">{identity?.fullName ?? ""}</span>

            <span className="text-note-2 text-neutral-70 dark:text-neutral-60">
                {!isMerchant ? translate("app.ui.header.aggregatorProfit") : translate("app.ui.header.totalBalance")}
            </span>

            {totalLoading && !totalAmount ? (
                <span>{translate("app.ui.header.totalLoading")}</span>
            ) : (
                <div className="relative w-full overflow-hidden">
                    <DropdownMenuTrigger>
                        <h1 className="text-display-5">
                            <div className="absolute inset-0">
                                {totalAmount?.map((el, index) => (
                                    <div
                                        key={el.currency}
                                        style={{
                                            transition: "opacity .1s ease-in-out, transform .3s ease-in-out"
                                        }}
                                        className={`absolute inset-0 flex items-center gap-[6px] ${
                                            totalAmount.length === 1
                                                ? "z-10 translate-y-0 opacity-100"
                                                : index === currentIndex
                                                  ? "z-10 translate-y-0 opacity-100 delay-0"
                                                  : "z-0 translate-y-full opacity-0 delay-300"
                                        }`}>
                                        {!isLoadingCurrencies && (
                                            <span className="block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-neutral-90 dark:text-white">
                                                {formatNumber(currencies, el, true)}
                                            </span>
                                        )}

                                        <div className="flex justify-center">
                                            <CurrencyIcon name={el.currency} textSmall />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </h1>
                    </DropdownMenuTrigger>
                </div>
            )}
        </div>
    );
};
