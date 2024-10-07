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
import { useLocation, useNavigate } from "react-router-dom";
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
    LanguagesIcon,
    BitcoinIcon,
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    MessagesSquareIcon,
    XIcon
} from "lucide-react";
import { useTheme } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/lib/icons/Logo";
import LogoPicture from "@/lib/icons/LogoPicture";
import Blowfish from "@/lib/icons/Blowfish";
import { ChatSheet } from "@/components/widgets/ChatSheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { debounce } from "lodash";

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

    const navigate = useNavigate();

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
            return translate(`app.menu.${resourceName[0].replace(/-./g, x => x[1].toUpperCase())}`);
        }
    }, [resourceName, translate]);

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
    const debounced = debounce(setChatOpen, 100);

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
            <header className="flex h-[84px] shrink-0 z-[2] items-center justify-end gap-4 bg-header pr-6">
                {identity?.data && (
                    <div className="flex items-center justify-end gap-2">
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
                                                ? "flex items-center justify-center cursor-pointer  w-[60px] h-[60px] border-2 border-green-50 bg-green-50 transition-colors duration-150"
                                                : "flex items-center justify-center cursor-pointer  w-[60px] h-[60px] border-2 border-green-40 hover:border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
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
            <div className="flex flex-col grow h-full overflow-hidden">
                <aside
                    className={
                        isSheetOpen
                            ? "w-[280px] fixed h-full flex-col justify-start items-center bg-header transition-[width] pt-6"
                            : "w-[72px] h-full fixed flex-col justify-start items-center bg-header transition-[width] pt-6"
                    }>
                    {isSheetOpen ? (
                        <div className="flex justify-center items-center h-[63px] gap-6">
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
                            <NavLink
                                key={resource}
                                to={`/${resource}`}
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
                <div
                    className={
                        isSheetOpen
                            ? " bg-muted grow ml-[280px] overflow-y-auto p-8 scrollbar-stable transition-[margin-left]"
                            : " bg-muted grow ml-[72px] overflow-y-auto p-8 scrollbar-stable transition-[margin-left]"
                    }>
                    <main className="p-6 container">
                        <h1 className="text-3xl mb-6">{pageTitle}</h1>
                        {children}
                    </main>
                </div>
                <Toaster />
            </div>
        </div>
    );
};
