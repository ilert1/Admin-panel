import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatValue } from "@/helpers/formatNumber";
import { useEffect, useState } from "react";
import { CurrencyIcon } from "./CurrencyIcon";
import { UserIdentity, useTranslate } from "react-admin";
import SnowFlakeIcon from "@/lib/icons/snowflake.svg?react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface IBalanceDisplay {
    totalAmount: AccountBalance[] | undefined;
    isMerchant: boolean;
    identity: UserIdentity | undefined;
    totalLoading: boolean;
}

export const BalanceDisplay = ({ totalAmount, isMerchant, identity, totalLoading }: IBalanceDisplay) => {
    const translate = useTranslate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [combinedAmounts, setCombinedAmounts] = useState<ICombinedBalances[]>();

    useEffect(() => {
        function combine() {
            const combined: ICombinedBalances[] = [];
            totalAmount?.map(el => {
                combined.push({ value: el.value, currency: el.currency, type: "balance" });
                if (el.holds.quantity !== 0) {
                    combined.push({ value: el.holds, currency: el.currency, type: "hold" });
                }
            });
            return combined;
        }
        if (!totalLoading) {
            const combined = combine();
            setCombinedAmounts(combined);
        }
    }, [totalAmount, totalLoading]);

    useEffect(() => {
        if (!combinedAmounts?.length) return;
        let interval: NodeJS.Timeout;

        if (combinedAmounts?.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % combinedAmounts?.length);
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [combinedAmounts?.length]);

    return (
        <div className="flex min-w-[137px] flex-col items-start gap-[2px]">
            <span className="text-title-2 text-neutral-90 dark:text-neutral-0">{identity?.fullName ?? ""}</span>

            <span className="text-note-2 text-neutral-70 dark:text-neutral-60">
                {!isMerchant ? translate("app.ui.header.aggregatorProfit") : translate("app.ui.header.totalBalance")}
            </span>

            {totalLoading && !totalAmount ? (
                <span>{translate("app.ui.header.totalLoading")}</span>
            ) : (
                <div className="relative h-full w-full overflow-hidden">
                    <DropdownMenuTrigger className="block !h-[24px] w-full">
                        <h1 className="text-display-5 relative h-full w-full overflow-hidden text-center">
                            <AnimatePresence mode="popLayout">
                                {combinedAmounts && combinedAmounts.length > 0 && (
                                    <motion.div
                                        key={`${combinedAmounts[currentIndex].currency}-${combinedAmounts[currentIndex].type}-${currentIndex}`}
                                        className="absolute inset-0 flex items-center gap-2"
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -100, opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}>
                                        {combinedAmounts[currentIndex].type === "hold" && (
                                            <SnowFlakeIcon className="h-4 w-4" />
                                        )}

                                        {!totalLoading && (
                                            <span
                                                className={cn(
                                                    "block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-neutral-90 dark:text-white",
                                                    combinedAmounts[currentIndex].type === "hold" &&
                                                        "text-extra-7 dark:text-extra-7"
                                                )}>
                                                {formatValue(
                                                    combinedAmounts[currentIndex].value.quantity,
                                                    combinedAmounts[currentIndex].value.accuracy,
                                                    2
                                                )}
                                            </span>
                                        )}

                                        <div className="flex justify-center">
                                            <CurrencyIcon
                                                className={
                                                    combinedAmounts[currentIndex].type === "hold"
                                                        ? "!fill-extra-7 !text-extra-7"
                                                        : ""
                                                }
                                                name={combinedAmounts[currentIndex].currency}
                                                textSmall
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </h1>
                    </DropdownMenuTrigger>
                </div>
            )}
        </div>
    );
};
