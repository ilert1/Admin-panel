import { useTheme } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_URL } from "@/data/base";
import Blowfish from "@/lib/icons/Blowfish";
import { useEffect, useMemo, useState } from "react";
import { useGetIdentity, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";
import { useQuery } from "react-query";
import { EllipsisVerticalIcon, LogOut, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LangSwitcher } from "../components/LangSwitcher";
import { CurrencyIcon } from "./CurrencyIcon";
import { HeaderButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useGetCurrencies } from "@/hooks/useGetCurrencies";
import { formatNumber } from "@/helpers/formatNumber";
// import { debounce } from "lodash";

export const Header = (props: { handleLogout: () => void }) => {
    const { setTheme, theme } = useTheme();
    const identity = useGetIdentity();
    const [profileOpen, setProfileOpen] = useState(false);
    // const [chatOpen, setChatOpen] = useState(false);
    // const debounced = debounce(setChatOpen, 120);

    const { currencies, isLoadingCurrencies } = useGetCurrencies();

    const appToast = useAppToast();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const isMerchant = useMemo(() => permissions === "merchant", [permissions]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const showError = (() => {
        let errorShown = false;
        return (message: string) => {
            if (!errorShown) {
                appToast("error", message);
                errorShown = true;
                setTimeout(() => (errorShown = false), 5000); // Сбрасываем флаг через 5 секунд
            }
        };
    })();

    const { isLoading: totalLoading, data: totalAmount } = useQuery(
        "totalAmount",
        async () => {
            const response = await fetch(`${API_URL}/accounts/balance/count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
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
        {
            retry: 2, // Ограничение повторных попыток
            onError: () => showError(translate("app.ui.header.totalError")),
            staleTime: 1000 * 60 * 5 // Кэширование на 5 минут
        }
    );

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
            className="z-100 relative flex flex-shrink-0 items-center gap-4 bg-header px-4 h-[84px] pointer-events-auto z"
            onClick={e => e.stopPropagation()}>
            {identity?.data && (
                <div className="flex items-center gap-2 mr-6 ml-auto">
                    <div className="!z-60 relative flex items-center gap-8">
                        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={true}>
                            <div
                                className={cn(
                                    "flex gap-4 items-center justify-center py-1 pl-4 pr-4 rounded-4 border box-border cursor-default",
                                    profileOpen
                                        ? `border-green-40 dark:border-[1px] bg-muted dark:border-neutral-20`
                                        : `border-green-20 bg-white dark:bg-muted dark:border-muted  cursor-default`
                                )}
                                style={{
                                    transition: "border-color .15s"
                                }}>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="flex justify-center items-center bg-muted border-2 border-green-40 w-[60px] h-[60px] cursor-pointer">
                                        <Blowfish />
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <div className="flex flex-col items-start gap-[2px] min-w-[137px]">
                                    <span className={"text-neutral-90 dark:text-neutral-0 text-title-2 cursor-default"}>
                                        {identity.data.fullName ? identity.data.fullName : ""}
                                    </span>
                                    <span className="text-neutral-70 text-note-2 dark:text-neutral-60">
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
                                                        {totalAmount?.map((el, index) => (
                                                            <div
                                                                key={el.currency}
                                                                style={{
                                                                    transition:
                                                                        "opacity .1s ease-in-out, transform .3s ease-in-out"
                                                                }}
                                                                className={`absolute inset-0 flex gap-[6px] items-center ${
                                                                    totalAmount.length === 1
                                                                        ? "translate-y-0 opacity-100 z-10"
                                                                        : index === currentIndex
                                                                        ? "translate-y-0 opacity-100 z-10 delay-0"
                                                                        : index ===
                                                                          (currentIndex + 1) % totalAmount.length
                                                                        ? "translate-y-full opacity-0 z-0 delay-300"
                                                                        : "translate-y-[200%] opacity-0 z-0 delay-300"
                                                                }`}>
                                                                {!isLoadingCurrencies && (
                                                                    <span className="block max-w-full overflow-ellipsis overflow-hidden text-neutral-90 dark:text-white whitespace-nowrap">
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
                                <DropdownMenuTrigger>
                                    <div
                                        className={
                                            profileOpen
                                                ? "border-0 outline-none text-controlElements focus:outline-0"
                                                : "border-0 group-hover:text-controlElements outline-none hover:text-controlElements transition-colors"
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
                                className={`p-0 w-72 border border-green-20 dark:border-neutral-20 z-[1000] flex flex-col gap-2 !rounded-4 bg-green-0 dark:bg-muted `}>
                                <div className="flex items-center content-start mt-[0.8rem] pr-4 pl-4">
                                    <Avatar className="w-5 h-5">
                                        <AvatarFallback
                                            className={`bg-green-50 transition-colors text-primary cursor-default text-white`}>
                                            {identity.data.fullName
                                                ? identity.data.fullName[0].toLocaleUpperCase()
                                                : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 text-neutral-100">
                                        <div className="text-neutral-90 text-title-1 dark:text-white cursor-default">
                                            {isMerchant
                                                ? translate("app.ui.roles.merchant")
                                                : translate("app.ui.roles.admin")}
                                        </div>
                                        {identity.data.email && (
                                            <div className="text-neutral-60 text-note-2 dark:text-neutral-50 cursor-default">
                                                {identity.data.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center content-start mb-1 pr-2 pl-4">
                                    <span className="self-start mt-[0.5rem] mb-1 text-neutral-60 text-note-2">
                                        {!isMerchant
                                            ? translate("app.ui.header.accurateAggregatorProfit")
                                            : translate("app.ui.header.accurateBalance")}
                                    </span>
                                    <div
                                        className={`flex flex-col gap-[2px] items-start max-h-[250px] w-full pr-2 overflow-x-hidden overflow-y-auto `}>
                                        {!totalLoading && totalAmount ? (
                                            totalAmount.map(el => (
                                                <div
                                                    className="flex justify-between items-center w-full"
                                                    key={el.currency}>
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
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center content-start pr-4 pl-4">
                                    <Switch
                                        checked={theme === "light"}
                                        onCheckedChange={toggleTheme}
                                        className="data-[state=checked]:bg-green-60 data-[state=unchecked]:bg-muted dark:border-green-40"
                                    />
                                    <span className="ml-3 text-neutral-60 dark:text-neutral-50 cursor-default">
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
