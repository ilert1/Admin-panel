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
import { useMemo, createElement, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    HandCoinsIcon,
    PanelLeftIcon,
    MoonIcon,
    SunIcon,
    LayoutDashboardIcon,
    LanguagesIcon,
    BitcoinIcon
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { camelize } from "@/helpers/utils";
import { Toaster } from "@/components/ui/toaster";

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

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex min-h-screen w-full flex-col bg-muted">
                <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col justify-between border-r bg-background sm:flex">
                    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                        <Tooltip>
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
                        </Tooltip>
                        {Object.keys(resources).map(resource => (
                            <Tooltip key={resource}>
                                <TooltipTrigger asChild>
                                    <NavLink
                                        to={`/${resource}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                        {createElement(resources[resource].icon)}
                                        <span className="sr-only">{getResourceLabel(resources[resource].name)}</span>
                                    </NavLink>
                                </TooltipTrigger>
                                <TooltipContent className="border-tooltip-info_bold" side="right">
                                    {getResourceLabel(resources[resource].name)}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {merchantOnly && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to="/bank-transfer"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                            <HandCoinsIcon />
                                            <span className="sr-only">{translate("app.menu.bankTransfer")}</span>
                                        </NavLink>
                                    </TooltipTrigger>
                                    <TooltipContent className="border-tooltip-info_bold" side="right">
                                        {translate("app.menu.bankTransfer")}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to="/crypto-transfer"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                            <BitcoinIcon />
                                            <span className="sr-only">
                                                {translate("app.menu.cryptoWalletTransfer")}
                                            </span>
                                        </NavLink>
                                    </TooltipTrigger>
                                    <TooltipContent className="border-tooltip-info_bold" side="right">
                                        {translate("app.menu.cryptoWalletTransfer")}
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                    </nav>
                    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
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
                    </nav>
                </aside>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 sm:z-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline" className="sm:hidden">
                                    <PanelLeftIcon className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="sm:max-w-xs flex flex-col justify-between">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <NavLink
                                        to="/"
                                        onClick={() => setSheetOpen(false)}
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                        <LayoutDashboardIcon className="h-5 w-5" />
                                        {translate("app.menu.dashboard")}
                                    </NavLink>
                                    {Object.keys(resources).map(resource => (
                                        <NavLink
                                            key={resource}
                                            to={`/${resource}`}
                                            onClick={() => setSheetOpen(false)}
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                            {createElement(resources[resource].icon, {
                                                className: "h-5 w-5"
                                            })}
                                            {getResourceLabel(resources[resource].name)}
                                        </NavLink>
                                    ))}
                                    {merchantOnly && (
                                        <>
                                            <NavLink
                                                to="/bank-transfer"
                                                onClick={() => setSheetOpen(false)}
                                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                                <HandCoinsIcon className="h-5 w-5" />
                                                {translate("app.menu.bankTransfer")}
                                            </NavLink>
                                            <NavLink
                                                to="/crypto-transfer"
                                                onClick={() => setSheetOpen(false)}
                                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                                <BitcoinIcon className="h-5 w-5" />
                                                {translate("app.menu.cryptoWalletTransfer")}
                                            </NavLink>
                                        </>
                                    )}
                                </nav>
                                <nav className="grid gap-6 text-lg font-medium">
                                    <NavLink
                                        to="#"
                                        onClick={toggleTheme}
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                        {theme === "light" ? <SunIcon /> : <MoonIcon />}
                                        {theme === "dark" ? translate("app.theme.dark") : translate("app.theme.light")}
                                    </NavLink>
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Breadcrumb className="hidden sm:flex">
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
                        </Breadcrumb>
                        {identity?.data && (
                            <div className="relative ml-auto flex flex-row gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarFallback>
                                                <LanguagesIcon className="h-5 w-5" />
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={identity.data.avatar} />
                                            <AvatarFallback>
                                                {identity.data.fullName?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{identity.data.fullName}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout}>
                                            {translate("ra.auth.logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </header>
                    <main className="p-4 sm:px-6 sm:py-0 container">{children}</main>
                </div>
            </div>
            <Toaster />
        </TooltipProvider>
    );
};
