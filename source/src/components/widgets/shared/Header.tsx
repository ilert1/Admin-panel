import { useTheme } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { API_URL } from "@/data/base";
import Blowfish from "@/lib/icons/Blowfish";
import { useEffect, useMemo, useState } from "react";
import { useGetIdentity, useI18nProvider, useLocaleState, usePermissions, useTranslate } from "react-admin";
import { NumericFormat } from "react-number-format";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { Icon } from "./Icon";
import { EllipsisVerticalIcon, LanguagesIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
// import { debounce } from "lodash";

export const Header = (props: { handleLogout: () => void }) => {
    const { setTheme, theme } = useTheme();
    const [locale, setLocale] = useLocaleState();
    const identity = useGetIdentity();
    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    // const [chatOpen, setChatOpen] = useState(false);
    // const debounced = debounce(setChatOpen, 120);
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);
    const { getLocales } = useI18nProvider();
    const [currentIndex, setCurrentIndex] = useState(0);

    const changeLocale = (value: string) => {
        if (locale !== value) {
            localStorage.setItem("i18nextLng", value);
            setLocale(value);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const showError = (() => {
        let errorShown = false;
        return (message: string) => {
            if (!errorShown) {
                toast.error(translate("resources.transactions.show.error"), {
                    dismissible: true,
                    description: message,
                    duration: 3000
                });
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
            return json.data as Balance[];
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
    console.log(identity?.data);
    return (
        <header
            className="flex flex-shrink-0 h-[84px] items-center gap-4 bg-header px-4 relative z-100 pointer-events-auto z"
            onClick={e => e.stopPropagation()}>
            {identity?.data && (
                <div className="ml-auto flex items-center gap-2 mr-6">
                    <div className="flex items-center gap-8 relative !z-60">
                        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={true}>
                            <div
                                className={
                                    profileOpen
                                        ? "flex gap-4 items-center justify-center py-1 pl-4 pr-2 bg-muted rounded-4 border border-neutral-80 box-border transition-colors transition-150 cursor-default"
                                        : "flex gap-4 items-center justify-center py-1 pl-4 pr-2 bg-muted rounded-4 border border-muted box-border transition-colors transition-150 cursor-default"
                                }>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="flex items-center justify-center w-[60px] h-[60px] border-2 border-green-40 bg-muted cursor-pointer">
                                        <Blowfish />
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <div className="flex flex-col gap-[2px] items-start min-w-[137px]">
                                    <span className={"text-neutral-100 text-title-2 cursor-default"}>
                                        {identity.data.fullName ? identity.data.fullName : ""}
                                    </span>
                                    <span className="text-note-2 text-neutral-60">
                                        {translate("app.ui.header.totalBalance")}
                                    </span>
                                    {totalLoading && !totalAmount ? (
                                        <span>{translate("app.ui.header.totalLoading")}</span>
                                    ) : (
                                        <div className="w-full relative overflow-hidden">
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
                                                                className={`absolute inset-0 flex justify-between items-center ${
                                                                    totalAmount.length === 1
                                                                        ? "translate-y-0 opacity-100 z-10"
                                                                        : index === currentIndex
                                                                        ? "translate-y-0 opacity-100 z-10 delay-0"
                                                                        : index ===
                                                                          (currentIndex + 1) % totalAmount.length
                                                                        ? "translate-y-full opacity-0 z-0 delay-300"
                                                                        : "translate-y-[200%] opacity-0 z-0 delay-300"
                                                                }`}>
                                                                <NumericFormat
                                                                    className="whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full block text-display-4"
                                                                    value={
                                                                        Math.round(
                                                                            (el.value.quantity / el.value.accuracy) *
                                                                                10000
                                                                        ) / 10000
                                                                    }
                                                                    displayType={"text"}
                                                                    thousandSeparator=" "
                                                                    decimalSeparator=","
                                                                />
                                                                <div className="flex justify-center">
                                                                    <Icon name={el.currency} folder="currency" />
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
                                                ? "text-green-40 focus:outline-0"
                                                : "group-hover:text-green-40 outline-none hover:text-green-40 transition-colors"
                                        }>
                                        <EllipsisVerticalIcon />
                                    </div>
                                </DropdownMenuTrigger>
                            </div>
                            <DropdownMenuContent
                                sideOffset={34}
                                align="end"
                                alignOffset={-18}
                                className="p-0 w-72 bg-muted border border-neutral-80 z-[1000] flex flex-col gap-2 !rounded-4">
                                <div className="flex content-start items-center pl-4 pr-4 mt-[0.8rem]">
                                    <Avatar className="w-5 h-5">
                                        <AvatarFallback className="bg-green-50 transition-colors text-body cursor-default">
                                            {identity.data.fullName
                                                ? identity.data.fullName[0].toLocaleUpperCase()
                                                : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-3 text-neutral-100">
                                        <div className="text-title-1 cursor-default">
                                            {merchantOnly
                                                ? translate("app.ui.roles.merchant")
                                                : translate("app.ui.roles.admin")}
                                        </div>
                                        {identity.data.email && (
                                            <div className="text-note-2 cursor-default text-neutral-40">
                                                {identity.data.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex content-start items-center pl-4 pr-4 mb-1">
                                    <div className="flex flex-col gap-[2px] items-start max-h-[250px] overflow-y-auto w-full">
                                        <span className="text-note-2 text-neutral-40 mt-[0.5rem] mb-1">
                                            {translate("app.ui.header.accurateBalance")}
                                        </span>

                                        {!totalLoading && totalAmount ? (
                                            totalAmount.map(el => (
                                                <div
                                                    className="flex items-center w-[100%] justify-between"
                                                    key={el.currency}>
                                                    <h4 className="text-display-4">
                                                        <NumericFormat
                                                            className="whitespace-nowrap"
                                                            value={el.value.quantity / el.value.accuracy}
                                                            displayType={"text"}
                                                            thousandSeparator=" "
                                                            decimalSeparator=","
                                                            style={{
                                                                fontSize: "20px !important"
                                                            }}
                                                        />
                                                    </h4>
                                                    <div className="flex justify-center">
                                                        <Icon name={el.currency} folder="currency" />
                                                    </div>
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
                                        className="border-green-40 data-[state=checked]:bg-muted data-[state=unchecked]:bg-muted"
                                    />
                                    <span className="ml-3 cursor-default text-neutral-50">
                                        {theme === "dark" ? translate("app.theme.light") : translate("app.theme.dark")}
                                    </span>
                                </div>
                                <DropdownMenuItem
                                    className="pl-4 pr-4 h-[50px] hover:bg-green-50 hover:cursor-pointer text-title-2 focus:bg-green-50"
                                    onClick={props.handleLogout}>
                                    {translate("ra.auth.logout")}
                                </DropdownMenuItem>
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
                                            <MessagesSquareIcon className="h-[30px] w-[30px]" />
                                        </Avatar>
                                    </div>
                                </SheetTrigger>
                                <SheetContent
                                    className="sm:max-w-[520px] !top-[84px] !max-h-[calc(100vh-84px)] w-full p-0 m-0"
                                    close={false}>
                                    <SheetHeader className="p-4 bg-green-60">
                                        <div className="flex justify-between items-center ">
                                            <SheetTitle className="text-display-3">
                                                {translate("app.ui.actions.chatWithSupport")}
                                            </SheetTitle>
                                            <button
                                                tabIndex={-1}
                                                onClick={() => setChatOpen(false)}
                                                className="text-gray-500 hover:text-gray-700 transition-colors outline-0 border-0 -tab-1">
                                                <XIcon className="h-[28px] w-[28px]" />
                                            </button>
                                        </div>
                                    </SheetHeader>
                                    <SheetDescription></SheetDescription>
                                    <ChatSheet locale={locale} />
                                </SheetContent>
                            </Sheet> */}
                        <DropdownMenu open={langOpen} onOpenChange={setLangOpen} modal={true}>
                            <DropdownMenuTrigger asChild>
                                <Avatar
                                    className={
                                        langOpen
                                            ? "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                            : "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-50 hover:text-neutral-100 border-2 border-neutral-50 hover:border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                                    }>
                                    <LanguagesIcon className="h-[30px] w-[30px]" />
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="p-0 bg-muted border border-neutral-100 z-[60]">
                                {getLocales?.().map(locale => (
                                    <DropdownMenuItem
                                        key={locale.locale}
                                        onClick={() => changeLocale(locale.locale)}
                                        className="text-title-2 py-[14px] focus:bg-green-50 focus:cursor-pointer pl-4 pr-4">
                                        {locale.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </header>
    );
};
