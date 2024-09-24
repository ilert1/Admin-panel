import {
    CoreLayoutProps,
    useGetIdentity,
    useGetResourceLabel,
    useI18nProvider,
    useLocaleState,
    useLogout,
    usePermissions,
    useResourceDefinitions,
    useTranslate
} from "react-admin";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useMemo, createElement, useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
    HandCoinsIcon,
    // LayoutDashboardIcon,
    LanguagesIcon,
    BitcoinIcon,
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    MessagesSquareIcon
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/lib/icons/Logo";
import LogoPicture from "@/lib/icons/LogoPicture";
import Blowfish from "@/lib/icons/Blowfish";
import { ChatSheet } from "@/components/widgets/ChatSheet";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

export const MainLayout = ({ children }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);
    const location = useLocation();

    const resourceName = useMemo(() => {
        const resources = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

        Object.values(SplitLocations).forEach(item => {
            if (resources.includes(item)) {
                const tempResource = resources.splice(resources.indexOf(item) - 1, 2);
                resources.push(tempResource.join("/"));
            }
        });

        return resources;
    }, [location]);

    const identity = useGetIdentity();
    const logout = useLogout();
    const { setTheme, theme } = useTheme();
    const [locale, setLocale] = useLocaleState();
    const { getLocales } = useI18nProvider();

    const [isSheetOpen, setSheetOpen] = useState(false);
    const [showCaptions, setShowCaptions] = useState(false);
    const [pageTitle, setPageTitle] = useState(
        merchantOnly ? translate("app.menu.accounts") : translate("app.menu.transactions")
    );

    const [profileOpen, setProfileOpen] = useState(false);

    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => {
        isSheetOpen
            ? setTimeout(() => {
                  setShowCaptions(isSheetOpen);
              }, 150)
            : setShowCaptions(isSheetOpen);
    }, [isSheetOpen]);

    const changeLocale = (value: string) => {
        if (locale !== value) {
            setLocale(value);
        }
    };

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    const setNextPage = (nextLocation: string) => {
        setPageTitle(translate("app.menu." + nextLocation));
    };

    return (
        <div className="flex min-h-screen w-full bg-muted">
            <aside
                className={
                    isSheetOpen
                        ? "min-w-[280px] flex-col justify-start items-center bg-header transition-all pt-[84px]"
                        : "min-w-[72px] flex-col justify-start items-center bg-header transition-all pt-[84px]"
                }>
                {isSheetOpen ? (
                    <div className="flex justify-center items-center mt-6 h-[63px] gap-6">
                        <div className="flex items-center w-[189px] m-0 p-0">
                            <div className="animate-in fade-in-0 transition-opacity duration-700">
                                <LogoPicture />
                            </div>
                            <div className="animate-in ml-4 fade-in-0 transition-opacity duration-700">
                                <Logo />
                            </div>
                        </div>
                        <button className="flex flex-col items-center animate-in fade-in-0 transition-opacity duration-300">
                            <ChevronLeftCircleIcon
                                onClick={() => setSheetOpen(!isSheetOpen)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                            />
                        </button>
                    </div>
                ) : (
                    <div className="w-[70px] flex justify-center">
                        <button className="mt-6 h-[63px] ">
                            <ChevronRightCircleIcon
                                onClick={() => setSheetOpen(!isSheetOpen)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                            />
                        </button>
                    </div>
                )}

                <nav className="flex flex-col items-baseline text-base gap-4 mt-6 pl-6">
                    {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink
                                    to="/"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                    <LayoutDashboardIcon />
                                    <span className="sr-only">{translate("app.menu.dashboard")}</span>
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent className="border-tooltip-info_bold" side="right">
                                {translate("app.menu.dashboard")}
                            </TooltipContent>
                        </Tooltip> */}
                    {Object.keys(resources).map(resource => (
                        <NavLink
                            key={resource}
                            to={`/${resource}`}
                            onClick={() => {
                                setNextPage(resource);
                            }}
                            className={
                                resourceName[0] === resource
                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                            }>
                            {createElement(resources[resource].icon, {})}
                            {showCaptions ? (
                                <span className="animate-in fade-in-0 transition-opacity">
                                    {getResourceLabel(resources[resource].name)}
                                </span>
                            ) : null}
                        </NavLink>
                    ))}
                    {merchantOnly && (
                        <NavLink
                            to="/bank-transfer"
                            onClick={() => setNextPage("bankTransfer")}
                            className={
                                resourceName[0] === "bank-transfer"
                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                            }>
                            <HandCoinsIcon />
                            {showCaptions ? (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                    {translate("app.menu.bankTransfer")}
                                </span>
                            ) : null}
                        </NavLink>
                    )}
                    {merchantOnly && (
                        <NavLink
                            to="/crypto-transfer"
                            onClick={() => setNextPage("cryptoWalletTransfer")}
                            className={
                                resourceName[0] === "crypto-transfer"
                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                            }>
                            <BitcoinIcon />
                            {showCaptions ? (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                    {translate("app.menu.cryptoWalletTransfer")}
                                </span>
                            ) : null}
                        </NavLink>
                    )}
                </nav>
            </aside>
            <div className="flex w-full flex-col ">
                <header className="flex h-[84px] items-center gap-4 bg-header px-4 z-100">
                    {identity?.data && (
                        <div className="ml-auto flex items-center gap-2 mr-6">
                            <div>
                                <span
                                    className={
                                        profileOpen
                                            ? "text-green-50 text-title-2 cursor-default"
                                            : "text-neutral-100 text-title-2 cursor-default"
                                    }>
                                    {identity.data.fullName ? identity.data.fullName : null}
                                </span>
                            </div>
                            <div className="flex items-center gap-8">
                                <DropdownMenu onOpenChange={setProfileOpen} modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar
                                            className={
                                                profileOpen
                                                    ? "flex items-center justify-center cursor-pointer  w-[60px] h-[60px] border-2 border-green-50 bg-green-50 transition-all duration-150"
                                                    : "flex items-center justify-center cursor-pointer  w-[60px] h-[60px] border-2 border-green-40 hover:border-green-50 bg-muted hover:bg-green-50 transition-all duration-150"
                                            }>
                                            <Blowfish />
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="p-0 w-56 bg-muted border border-neutral-100">
                                        <div className="flex content-start items-center pl-4 pr-4 h-[50px]">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback className="bg-green-50 transition-colors text-body cursor-default">
                                                    {identity.data.fullName
                                                        ? identity.data.fullName[0].toLocaleUpperCase()
                                                        : ""}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-3 text-neutral-100">
                                                <div className="text-title-1 cursor-default">
                                                    {identity.data.fullName}
                                                </div>
                                                {
                                                    //TODO: Set valid email
                                                }
                                                <div className="text-note-2 cursor-default">email@gmail.com</div>
                                            </div>
                                        </div>

                                        <div className="flex content-start items-center pl-4 pr-4 h-[50px]">
                                            <Switch
                                                checked={theme === "dark"}
                                                onCheckedChange={toggleTheme}
                                                className="border-green-50 data-[state=checked]:bg-muted data-[state=unchecked]:bg-muted"
                                            />
                                            <span className="ml-3 cursor-default">
                                                {theme === "dark"
                                                    ? translate("app.theme.light")
                                                    : translate("app.theme.dark")}
                                            </span>
                                        </div>
                                        <DropdownMenuItem
                                            className="pl-4 pr-4 h-[50px] focus:bg-green-50 focus:cursor-pointer text-title-2"
                                            onClick={logout}>
                                            {translate("ra.auth.logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <ChatSheet />
                                <DropdownMenu onOpenChange={setLangOpen} modal={false}>
                                    <DropdownMenuTrigger asChild className="">
                                        <Avatar
                                            className={
                                                langOpen
                                                    ? "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                                    : "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-50 hover:text-neutral-100 border-2 border-neutral-50 hover:border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                                            }>
                                            <LanguagesIcon className="h-[30px] w-[30px]" />
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="p-0 bg-muted border border-neutral-100">
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

                <main className="p-6 container">
                    <div>{pageTitle}</div>
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
};
