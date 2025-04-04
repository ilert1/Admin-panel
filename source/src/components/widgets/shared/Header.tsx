import { useTheme } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_URL } from "@/data/base";
import Blowfish from "@/lib/icons/Blowfish";
import { useEffect, useMemo, useState } from "react";
import { useGetIdentity, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVerticalIcon, LogOut, Settings, Snowflake } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LangSwitcher } from "../components/LangSwitcher";
import { CurrencyIcon } from "./CurrencyIcon";
import { HeaderButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { formatNumber } from "@/helpers/formatNumber";
import React from "react";
// import { debounce } from "lodash";

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
        let interval: NodeJS.Timeout;
        if (totalAmount) {
            interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % totalAmount.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [totalAmount, currentIndex]);

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
                                        <div className="relative w-full overflow-hidden">
                                            <DropdownMenuTrigger>
                                                <h1 className="text-display-5">
                                                    <div className="absolute inset-0">
                                                        {totalAmount &&
                                                            totalAmount
                                                                .flatMap(el => [
                                                                    { ...el, type: "available" },
                                                                    el.holds && {
                                                                        ...el,
                                                                        value: el.holds,
                                                                        type: "holds"
                                                                    }
                                                                ])
                                                                .filter(Boolean)
                                                                .map((el, index) => (
                                                                    <div
                                                                        key={`${el?.currency}-${el?.type}`}
                                                                        className="flex flex-col">
                                                                        <div
                                                                            style={{
                                                                                transition:
                                                                                    "opacity .1s ease-in-out, transform .3s ease-in-out"
                                                                            }}
                                                                            className={`absolute inset-0 flex items-center gap-[6px] ${
                                                                                totalAmount.length === 1
                                                                                    ? "z-10 translate-y-0 opacity-100"
                                                                                    : index === currentIndex
                                                                                      ? "z-10 translate-y-0 opacity-100 delay-0"
                                                                                      : index ===
                                                                                          (currentIndex + 1) %
                                                                                              totalAmount.length
                                                                                        ? "z-0 translate-y-full opacity-0 delay-300"
                                                                                        : "z-0 translate-y-[200%] opacity-0 delay-300"
                                                                            }`}>
                                                                            {!isLoadingCurrencies && (
                                                                                <span className="flex max-w-full items-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-neutral-90 dark:text-white">
                                                                                    {el?.type === "holds" && (
                                                                                        <Snowflake className="h-4 w-4 text-extra-7" />
                                                                                    )}
                                                                                    {el && el?.type === "holds"
                                                                                        ? el?.holds.quantity /
                                                                                          el?.holds.accuracy
                                                                                        : formatNumber(
                                                                                              currencies,
                                                                                              el,
                                                                                              true
                                                                                          ).balance}
                                                                                </span>
                                                                            )}
                                                                            <div className="flex justify-center">
                                                                                <CurrencyIcon
                                                                                    name={el?.currency ?? ""}
                                                                                    textSmall
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                    </div>
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
                                <div className="mb-1 flex flex-col content-start items-center pl-4 pr-2">
                                    <span className="mb-1 mt-[0.5rem] self-start text-note-2 text-neutral-60">
                                        {!isMerchant
                                            ? translate("app.ui.header.accurateAggregatorProfit")
                                            : translate("app.ui.header.accurateBalance")}
                                    </span>
                                    <div
                                        className={`flex max-h-[250px] w-full flex-col items-start gap-[2px] overflow-y-auto overflow-x-hidden pr-2`}>
                                        {!totalLoading && totalAmount ? (
                                            totalAmount.map(el => (
                                                <React.Fragment key={el.currency}>
                                                    <div className="flex w-full items-center justify-between">
                                                        <h4 className="overflow-y-hidden text-display-4 text-neutral-90 dark:text-white">
                                                            <NumericFormat
                                                                className="whitespace-nowrap"
                                                                value={el.value.quantity / el.value.accuracy}
                                                                displayType={"text"}
                                                                thousandSeparator=" "
                                                                decimalSeparator=","
                                                            />
                                                        </h4>
                                                        <div className="flex justify-center overflow-y-hidden">
                                                            <CurrencyIcon name={el.currency} />
                                                        </div>
                                                    </div>
                                                    {el.holds && el.holds.quantity !== 0 && (
                                                        <div className="flex w-full items-center justify-between">
                                                            <h4 className="flex items-center gap-1 overflow-y-hidden text-display-4 text-neutral-90 dark:text-white">
                                                                <Snowflake className="h-4 w-4 text-extra-7" />
                                                                <NumericFormat
                                                                    className="whitespace-nowrap"
                                                                    value={el.holds.quantity / el.holds.accuracy}
                                                                    displayType={"text"}
                                                                    thousandSeparator=" "
                                                                    decimalSeparator=","
                                                                />
                                                            </h4>
                                                            <div className="flex justify-center overflow-y-hidden">
                                                                <CurrencyIcon name={el.currency} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </React.Fragment>
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
