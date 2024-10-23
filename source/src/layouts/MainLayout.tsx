import {
    CoreLayoutProps,
    useGetIdentity,
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
    LanguagesIcon,
    CreditCardIcon,
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    MessagesSquareIcon,
    XIcon,
    KeyRound,
    ChevronLeft
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/lib/icons/Logo";
import LogoPicture from "@/lib/icons/LogoPicture";
import Blowfish from "@/lib/icons/Blowfish";
import { ChatSheet } from "@/components/widgets/components/ChatSheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { AdminCryptoStoreResources } from "@/components/widgets/shared";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

export const MainLayout = ({ children }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResLabel = useGetResLabel();
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

    const pageTitle = useMemo(() => {
        if (resourceName.length > 0) {
            if (resourceName[0] === "bank-transfer") {
                return translate("app.menu.merchant.bankTransfer");
            }
            return getResLabel(resourceName[0], permissions);
        }
    }, [getResLabel, permissions, resourceName, translate]);

    const identity = useGetIdentity();
    const logout = useLogout();
    //TODO for better UX we should set last location in localStorage to save it while user presses browser "refresh" button
    const handleLogout = () => {
        location.pathname = "/";
        logout();
    };

    const { setTheme, theme } = useTheme();
    const [locale, setLocale] = useLocaleState();
    const { getLocales } = useI18nProvider();

    const [isSheetOpen, setSheetOpen] = useState(false);
    const [showCaptions, setShowCaptions] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [testKeysModalOpen, setTestKeysModalOpen] = useState(false);

    const debounced = debounce(setChatOpen, 120);

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

    return (
        <div className="flex flex-col h-screen">
            <header
                className="flex flex-shrink-0 h-[84px] items-center gap-4 bg-header px-4 relative z-100 pointer-events-auto z"
                onClick={e => e.stopPropagation()}>
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
                        <div className="flex items-center gap-8 relative !z-60">
                            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={true}>
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
                                    className="p-0 w-56 bg-muted border border-neutral-100 z100">
                                    <div className="flex content-start items-center pl-4 pr-4 h-[50px]">
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="bg-green-50 transition-colors text-body cursor-default">
                                                {identity.data.fullName
                                                    ? identity.data.fullName[0].toLocaleUpperCase()
                                                    : ""}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-3 text-neutral-100">
                                            <div className="text-title-1 cursor-default">{identity.data.fullName}</div>
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
                                        onClick={handleLogout}>
                                        {translate("ra.auth.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Sheet
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
                            </Sheet>
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
                                <DropdownMenuContent
                                    align="end"
                                    className="p-0 bg-muted border border-neutral-100 z-[60]">
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
            <div className="flex grow h-full overflow-hidden">
                <aside
                    className={
                        isSheetOpen
                            ? "w-[280px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden scrollbar-stable justify-start bg-header transition-[width] pt-6"
                            : "w-[72px] h-full flex flex-col items-stretch flex-shrink-0 overflow-y-auto overflow-x-hidden scrollbar-stable justify-start bg-header transition-[width] pt-6"
                    }>
                    {isSheetOpen ? (
                        <div className="flex flex-shrink-0 justify-center items-center h-[63px] gap-6">
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
                            <button className="h-[63px] ">
                                <ChevronRightCircleIcon
                                    onClick={() => setSheetOpen(!isSheetOpen)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-green-50 transition-colors hover:text-foreground"
                                />
                            </button>
                        </div>
                    )}

                    <nav className="flex flex-col items-baseline text-base gap-4 mt-6 pl-6">
                        {Object.keys(resources).map(resource => (
                            <TooltipProvider key={resource} delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to={`/${resource}`}
                                            className={
                                                resourceName[0] === resource
                                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                            }>
                                            {createElement(resources[resource].icon, {})}
                                            {showCaptions && (
                                                <span className="animate-in fade-in-0 transition-opacity">
                                                    {getResLabel(resources[resource].name, permissions)}
                                                </span>
                                            )}
                                        </NavLink>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className={
                                            showCaptions
                                                ? "hidden"
                                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                                        }
                                        sideOffset={12}
                                        side="right">
                                        {getResLabel(resources[resource].name, permissions)}
                                        <ChevronLeft
                                            className="absolute -left-[13px] top-1.5 text-green-40"
                                            width={20}
                                            height={20}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                        {merchantOnly && (
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <NavLink
                                            to="/bank-transfer"
                                            className={
                                                resourceName[0] === "bank-transfer"
                                                    ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                                    : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                            }>
                                            <CreditCardIcon />
                                            {showCaptions && (
                                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                                    {translate("app.menu.merchant.bankTransfer")}
                                                </span>
                                            )}
                                        </NavLink>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className={
                                            showCaptions
                                                ? "hidden"
                                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                                        }
                                        sideOffset={12}
                                        side="right">
                                        {translate("app.menu.merchant.bankTransfer")}
                                        <ChevronLeft
                                            className="absolute -left-[13px] top-1.5 text-green-40"
                                            width={20}
                                            height={20}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {permissions === "admin" && <AdminCryptoStoreResources showCaptions={showCaptions} />}
                        {/* {merchantOnly && (
                            <NavLink
                                to="/crypto-transfer"
                                className={
                                    resourceName[0] === "crypto-transfer"
                                        ? "flex items-center gap-3 text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                        : "flex items-center gap-3 hover:text-green-40 animate-in fade-in-0 transition-colors duration-150 py-2"
                                }>
                                <BitcoinIcon />
                                {showCaptions ? (
                                    <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                        {translate("app.menu.merchant.cryptoOperations")}
                                    </span>
                                ) : null}
                            </NavLink>
                        )} */}
                    </nav>

                    {permissions === "admin" && (
                        <div className="flex flex-grow items-end ml-[18px] mr-[10px] mb-6 mt-4">
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className={
                                                showCaptions ? "w-full pl-6 flex gap-[4px] text-title-1" : "p-2.5"
                                            }
                                            onClick={() => {
                                                setTestKeysModalOpen(true);
                                            }}>
                                            <KeyRound className="w-[16px] h-[16px]" />
                                            {showCaptions ? (
                                                <span className="animate-in fade-in-0 transition-opacity p-0 m-0">
                                                    {translate("resources.provider.createTestKeys")}
                                                </span>
                                            ) : null}
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className={
                                            showCaptions
                                                ? "hidden"
                                                : "after:absolute after:-left-[3.5px] after:top-[12.5px] after:w-2 after:h-2 after:bg-neutral-0 after:rotate-45"
                                        }
                                        side="right"
                                        sideOffset={12}>
                                        {translate("resources.provider.createTestKeys")}
                                        <ChevronLeft
                                            className="absolute -left-[13px] top-1.5 text-green-40"
                                            width={20}
                                            height={20}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </aside>

                <div className="bg-muted grow overflow-y-auto scrollbar-stable transition-[margin-left]">
                    <main className="p-6 pr-4 container">
                        <h1 className="text-3xl mb-6">{pageTitle}</h1>
                        {children}
                    </main>
                </div>

                <Toaster />
            </div>

            <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
        </div>
    );
};
