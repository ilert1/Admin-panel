import { useTheme } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_URL } from "@/data/base";
import Blowfish from "@/lib/icons/Blowfish";
import { useEffect, useMemo, useState } from "react";
import { useGetIdentity, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVerticalIcon, LogOut, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LangSwitcher } from "../components/LangSwitcher";
import { CurrencyIcon } from "./CurrencyIcon";
import { HeaderButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { formatValue } from "@/helpers/formatNumber";
import SnowFlakeIcon from "@/lib/icons/snowflake.svg?react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
// import { debounce } from "lodash";

interface ICombinedBalances {
    value: { quantity: number; accuracy: number };
    currency: string;
    type: "balance" | "hold";
}

export const Header = (props: { handleLogout: () => void }) => {
    const { setTheme, theme } = useTheme();
    const identity = useGetIdentity();
    const [profileOpen, setProfileOpen] = useState(false);
    // const [chatOpen, setChatOpen] = useState(false);
    // const debounced = debounce(setChatOpen, 120);

    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    const translate = useTranslate();
    const { permissions } = usePermissions();
    const isMerchant = useMemo(() => permissions === "merchant", [permissions]);
    const [combinedAmounts, setCombinedAmounts] = useState<ICombinedBalances[]>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const { isLoading: totalLoading, data: totalAmount } = useQuery({
        queryKey: ["totalAmount"],
        queryFn: async ({ signal }) => {
            const response = await fetch(`${API_URL}/accounts/balance/count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                },
                signal
            });

            if (!response.ok) {
                throw new Error(translate("app.ui.header.totalError"));
            }
            const json = await response.json();
            if (!json.success) {
                throw new Error(translate("app.ui.header.totalError"));
            }

            return json.data as AccountBalance[];
        },
        retry: 2, // Ограничение повторных попыток
        staleTime: 1000 * 60 * 5 // Кэширование на 5 минут
    });

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
        <header
            className="z-100 z pointer-events-auto relative flex h-[84px] flex-shrink-0 items-center gap-4 bg-header px-4"
            onClick={e => e.stopPropagation()}>
            {identity?.data && (
                <div className="ml-auto mr-6 flex items-center gap-2">
                    <div className="!z-60 relative flex items-center gap-8">
                        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={true}>
                            <div
                                className={cn(
                                    "box-border flex cursor-default items-center justify-center gap-4 rounded-4 border py-1 pl-4 pr-4",
                                    profileOpen
                                        ? `border-green-40 bg-muted dark:border-[1px] dark:border-neutral-20`
                                        : `cursor-default border-green-20 bg-white dark:border-muted dark:bg-muted`
                                )}
                                style={{
                                    transition: "border-color .15s"
                                }}>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center border-2 border-green-40 bg-muted">
                                        <Blowfish />
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <div className="flex min-w-[137px] flex-col items-start gap-[2px]">
                                    <span className={"cursor-default text-title-2 text-neutral-90 dark:text-neutral-0"}>
                                        {identity.data.fullName ? identity.data.fullName : ""}
                                    </span>
                                    <span className="text-note-2 text-neutral-70 dark:text-neutral-60">
                                        {!isMerchant
                                            ? translate("app.ui.header.aggregatorProfit")
                                            : translate("app.ui.header.totalBalance")}
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
                                                                {!isLoadingCurrencies && (
                                                                    <span
                                                                        className={cn(
                                                                            "block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-neutral-90 dark:text-white",
                                                                            combinedAmounts[currentIndex].type ===
                                                                                "hold" &&
                                                                                "text-extra-7 dark:text-extra-7"
                                                                        )}>
                                                                        {formatValue(
                                                                            combinedAmounts[currentIndex].value
                                                                                .quantity,
                                                                            combinedAmounts[currentIndex].value
                                                                                .accuracy,
                                                                            2
                                                                        )}
                                                                    </span>
                                                                )}
                                                                <div className="flex justify-center">
                                                                    <CurrencyIcon
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
                                <DropdownMenuTrigger>
                                    <div
                                        className={
                                            profileOpen
                                                ? "border-0 text-controlElements outline-none focus:outline-0"
                                                : "border-0 outline-none transition-colors hover:text-controlElements group-hover:text-controlElements"
                                        }>
                                        <EllipsisVerticalIcon
                                            className={
                                                profileOpen
                                                    ? "text-green-50 dark:text-green-40"
                                                    : "text-green-60 hover:text-green-50 dark:text-white dark:hover:text-green-40"
                                            }
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                            </div>
                            <DropdownMenuContent
                                sideOffset={34}
                                align="end"
                                alignOffset={-18}
                                className={`z-[1000] flex w-72 flex-col gap-2 !rounded-4 border border-green-20 bg-green-0 p-0 dark:border-neutral-20 dark:bg-muted`}>
                                <div className="mt-[0.8rem] flex content-start items-center pl-4 pr-4">
                                    <Avatar className="h-5 w-5">
                                        <AvatarFallback
                                            className={`cursor-default bg-green-50 text-primary text-white transition-colors`}>
                                            {identity.data.fullName
                                                ? identity.data.fullName[0].toLocaleUpperCase()
                                                : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 text-neutral-100">
                                        <div className="cursor-default text-title-1 text-neutral-90 dark:text-white">
                                            {isMerchant
                                                ? translate("app.ui.roles.merchant")
                                                : translate("app.ui.roles.admin")}
                                        </div>
                                        {identity.data.email && (
                                            <div className="cursor-default text-note-2 text-neutral-60 dark:text-neutral-50">
                                                {identity.data.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                                        index % 2 ? "dark:bg-neutral-bb" : "dark:bg-neutral-100"
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
                                                                <SnowFlakeIcon className="h-5 w-5 text-extra-7" />
                                                                <NumericFormat
                                                                    className="whitespace-nowrap !text-title-1 text-extra-7"
                                                                    value={(
                                                                        el.holds.quantity / el.holds.accuracy
                                                                    ).toFixed(2)}
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
                                <div className="flex content-start items-center pl-4 pr-4">
                                    <Switch
                                        checked={theme === "light"}
                                        onCheckedChange={toggleTheme}
                                        className="data-[state=checked]:bg-green-60 data-[state=unchecked]:bg-muted dark:border-green-40"
                                    />
                                    <span className="ml-3 cursor-default text-neutral-60 dark:text-neutral-50">
                                        {theme === "dark" ? translate("app.theme.light") : translate("app.theme.dark")}
                                    </span>
                                </div>
                                <div>
                                    <HeaderButton
                                        text={translate("app.ui.header.settings")}
                                        Icon={Settings}
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("settings");
                                        }}
                                    />
                                    <HeaderButton
                                        text={translate("ra.auth.logout")}
                                        Icon={LogOut}
                                        onClick={props.handleLogout}
                                    />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Sheet
                                open={chatOpen}
                                onOpenChange={isOpen => {
                                    debounced(isOpen);
                                }}
                                modal={true}>
                                <SheetTrigger asChild>
                                    <div>
                                        <Avatar
                                            className={
                                                chatOpen
                                                    ? "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                                    : "flex items-center justify-center cursor-pointer w-[60px] h-[60px] text-green-50 hover:text-neutral-100 border-2 border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                                            }>
                                            <MessagesSquareIcon className="w-[30px] h-[30px]" />
                                        </Avatar>
                                    </div>
                                </SheetTrigger>
                                <SheetContent
                                    className="!top-[84px] m-0 p-0 w-full sm:max-w-[520px] !max-h-[calc(100vh-84px)]"
                                    close={false}>
                                    <SheetHeader className="bg-green-60 p-4">
                                        <div className="flex justify-between items-center">
                                            <SheetTitle className="text-display-3">
                                                {translate("app.ui.actions.chatWithSupport")}
                                            </SheetTitle>
                                            <button
                                                tabIndex={-1}
                                                onClick={() => setChatOpen(false)}
                                                className="border-0 outline-0 text-gray-500 hover:text-gray-700 transition-colors -tab-1">
                                                <XIcon className="w-[28px] h-[28px]" />
                                            </button>
                                        </div>
                                    </SheetHeader>
                                    <SheetDescription></SheetDescription>
                                    <ChatSheet locale={locale} />
                                </SheetContent>
                            </Sheet> */}
                        <LangSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
};
