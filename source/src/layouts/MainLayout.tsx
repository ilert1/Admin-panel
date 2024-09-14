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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
    HandCoinsIcon,
    MoonIcon,
    SunIcon,
    // LayoutDashboardIcon,
    LanguagesIcon,
    BitcoinIcon,
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    MessagesSquareIcon
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { camelize } from "@/helpers/utils";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/lib/icons/Logo";
import LogoPicture from "@/lib/icons/LogoPicture";
import Blowfish from "@/lib/icons/Blowfish";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

enum TransferLocations {
    bank = "bank-transfer",
    crypto = "crypto-transfer"
}

export const MainLayout = ({ children, title }: CoreLayoutProps) => {
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
    const resourceLabel = (item: string) => {
        if (Object.values<string>(TransferLocations).includes(item)) {
            return translate(`pages.${camelize(item)}.header`);
        } else if (item.includes("/show")) {
            return item.replace("/show", "");
        } else if (item) {
            return translate(`resources.${camelize(item)}.name`, { _: item, smart_count: 2 });
        } else {
            return null;
        }
    };

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
                        ? "w-72 flex-col justify-start items-center bg-header transition-all pt-[65px]"
                        : "w-14 flex-col justify-start items-center bg-header transition-all pt-[65px]"
                }>
                {isSheetOpen ? (
                    <div className="flex justify-between items-center pr-4 pt-4 pl-4">
                        <div className="mr-2 animate-in fade-in-0 transition-opacity duration-700">
                            <LogoPicture />
                        </div>
                        <div className="pr-2 animate-in fade-in-0 transition-opacity duration-700">
                            <Logo />
                        </div>
                        <div className="flex flex-col items-center gap-4 px-2 py-5 animate-in fade-in-0 transition-opacity duration-300">
                            <ChevronLeftCircleIcon
                                onClick={() => setSheetOpen(!isSheetOpen)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 px-2 py-5 mt-4">
                        <ChevronRightCircleIcon
                            onClick={() => setSheetOpen(!isSheetOpen)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                        />
                    </div>
                )}

                <nav className="flex flex-col items-baseline text-base gap-4 px-2 py-5">
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
                            className="flex items-center gap-4 px-2.5 hover:text-green-40 animate-in fade-in-0 transition-all duration-150">
                            {createElement(resources[resource].icon, {})}
                            {showCaptions ? (
                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                    {getResourceLabel(resources[resource].name)}
                                </span>
                            ) : null}
                        </NavLink>
                    ))}
                    {merchantOnly && (
                        <>
                            <NavLink
                                to="/bank-transfer"
                                onClick={() => setNextPage("bankTransfer")}
                                className="flex items-center gap-4 px-2.5 hover:text-green-40 animate-in fade-in-0 transition-all duration-150">
                                <HandCoinsIcon />
                                {showCaptions ? (
                                    <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                        {translate("app.menu.bankTransfer")}
                                    </span>
                                ) : null}
                            </NavLink>
                            <NavLink
                                to="/crypto-transfer"
                                onClick={() => setNextPage("cryptoWalletTransfer")}
                                className="flex items-center gap-4 px-2.5 hover:text-green-40 animate-in fade-in-0 transition-all  duration-150">
                                <BitcoinIcon />
                                {showCaptions ? (
                                    <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                        {translate("app.menu.cryptoWalletTransfer")}
                                    </span>
                                ) : null}
                            </NavLink>
                        </>
                    )}
                </nav>
                {/* <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink
                                    to="#"
                                    onClick={toggleTheme}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                    {theme === "light" ? <SunIcon /> : <MoonIcon />}
                                    <span className="sr-only">
                                        {theme === "dark" ? translate("app.theme.dark") : translate("app.theme.light")}
                                    </span>
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent className="border-tooltip-info_bold" side="right">
                                {theme === "dark" ? translate("app.theme.dark") : translate("app.theme.light")}
                            </TooltipContent>
                        </Tooltip>
                    </nav> */}
            </aside>
            <div className="flex w-full flex-col ">
                <header className="flex h-[84px] items-center gap-4 bg-header px-4">
                    {/* <Breadcrumb className="hidden sm:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <NavLink to="/">{title}</NavLink>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {resourceName.map((item, index) => (
                                <div
                                    className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
                                    key={index}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <NavLink to={`/${resourceName.slice(0, index + 1).join("/")}`}>
                                                {resourceLabel(item)}
                                            </NavLink>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb> */}
                    {identity?.data && (
                        <div className="ml-auto flex items-center gap-2">
                            <div>
                                <span className="text-neutral-100 text-title-2 cursor-default">
                                    {identity.data.fullName ? identity.data.fullName : null}
                                </span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="ml-4 mr-4">
                                    <Avatar className="cursor-pointer w-[60px] h-[60px]">
                                        <AvatarFallback className="border border-green-40 hover:border-green-50 hover:bg-green-50 transition-all duration-150">
                                            <Blowfish />
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="p-0 w-56">
                                    <div className="flex content-start items-center pl-4 pr-4 h-[50px]">
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="bg-green-50 transition-all text-body">
                                                {identity.data.fullName
                                                    ? identity.data.fullName[0].toLocaleUpperCase()
                                                    : ""}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-3 text-neutral-100">
                                            <div className="text-title-1">{identity.data.fullName}</div>
                                            {
                                                //TODO: Set valid email
                                            }
                                            <div className="text-note-2">email@gmail.com</div>
                                        </div>
                                    </div>

                                    <div className="flex content-start items-center pl-4 pr-4 h-[50px]">
                                        <Switch
                                            checked={theme === "dark"}
                                            onCheckedChange={toggleTheme}
                                            className="border-green-50"
                                        />
                                        <span className="ml-3">
                                            {theme === "dark"
                                                ? translate("app.theme.light")
                                                : translate("app.theme.dark")}
                                        </span>
                                    </div>
                                    <DropdownMenuItem className="pl-4 pr-4 h-[50px]" onClick={logout}>
                                        {translate("ra.auth.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Avatar className="ml-4 mr-4 cursor-pointer w-[60px] h-[60px] text-green-50 hover:text-neutral-100">
                                <AvatarFallback className="border border-green-50 hover:bg-green-50 transition-all duration-150">
                                    <MessagesSquareIcon className="h-[30px] w-[30px]" />
                                </AvatarFallback>
                            </Avatar>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="ml-4 mr-4">
                                    <Avatar className="cursor-pointer w-[60px] h-[60px] text-neutral-50 hover:text-neutral-100">
                                        <AvatarFallback className="border border-neutral-50 hover:border-green-50 hover:bg-green-50 transition-all duration-150">
                                            <LanguagesIcon className="h-[30px] w-[30px]" />
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {getLocales?.().map(locale => (
                                        <DropdownMenuItem
                                            key={locale.locale}
                                            onClick={() => changeLocale(locale.locale)}>
                                            {locale.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </header>

                <main className="p-4 sm:px-6 sm:py-0 container">
                    <div>{pageTitle}</div>
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
};
