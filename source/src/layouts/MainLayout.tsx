import {
    CoreLayoutProps,
    useGetIdentity,
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
    ChevronLeftCircleIcon,
    ChevronRightCircleIcon,
    // MessagesSquareIcon,
    // XIcon,
    KeyRound,
    ChevronLeft,
    EllipsisVerticalIcon
} from "lucide-react";
import { useTheme } from "@/components/providers";
import Logo from "@/lib/icons/Logo";
import LogoPicture from "@/lib/icons/LogoPicture";
import Blowfish from "@/lib/icons/Blowfish";
// import { ChatSheet } from "@/components/widgets/components/ChatSheet";
// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { NumericFormat } from "react-number-format";
import { Icon } from "@/components/widgets/shared/Icon";
import { useQuery } from "react-query";
import { API_URL } from "@/data/base";
import { toast } from "sonner";
import { LangSwitcher } from "@/components/widgets/components/LangSwitcher";

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

    const error = (message: string) => {
        toast.error(translate("resources.transactions.show.error"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const { isLoading: totalLoading, data: totalAmount } = useQuery("totalAmount", () =>
        fetch(`${API_URL}/accounts/balance/count`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    return json.data;
                } else {
                    error(translate("app.ui.header.totalError"));
                }
            })
            .catch(() => {
                error(translate("app.ui.header.totalError"));
            })
    );

    const resourceName = useMemo(() => {
        const urlParts = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

        Object.values(SplitLocations).forEach(item => {
            if (urlParts.includes(item)) {
                const tempResource = urlParts.splice(urlParts.indexOf(item) - 1, 2);
                urlParts.push(tempResource.join("/"));
            }
        });

        const isWrongResource =
            Object.keys(resources).length !==
            new Set([...Object.keys(resources), urlParts[0] !== "" && urlParts[0]]).size;

        return isWrongResource ? ["error"] : urlParts;
    }, [location, resources]);

    const pageTitle = useMemo(() => {
        if (resourceName.length > 0) {
            return getResLabel(resourceName[0], permissions);
        }
    }, [getResLabel, permissions, resourceName]);

    const identity = useGetIdentity();
    const logout = useLogout();
    const handleLogout = () => {
        location.pathname = "/";
        logout();
    };

    const { setTheme, theme } = useTheme();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [showCaptions, setShowCaptions] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [testKeysModalOpen, setTestKeysModalOpen] = useState(false);
    // const [chatOpen, setChatOpen] = useState(false);

    // const debounced = debounce(setChatOpen, 120);

    useEffect(() => {
        isSheetOpen
            ? setTimeout(() => {
                  setShowCaptions(isSheetOpen);
              }, 150)
            : setShowCaptions(isSheetOpen);
    }, [isSheetOpen]);

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
                        <div className="flex items-center gap-8 relative !z-60">
                            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal={true}>
                                <div
                                    className={
                                        profileOpen
                                            ? "flex gap-4 items-center justify-center py-1 px-4 bg-muted rounded-4 border border-neutral-80 box-border transition-colors transition-150 cursor-default"
                                            : "flex gap-4 items-center justify-center py-1 px-4 bg-muted rounded-4 border border-muted box-border transition-colors transition-150 cursor-default"
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
                                        {totalLoading || !totalAmount ? (
                                            <span>{translate("app.ui.header.totalLoading")}</span>
                                        ) : (
                                            <div className="flex gap-4 items-center">
                                                <h1 className="text-display-5">
                                                    <NumericFormat
                                                        className="whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[98px] block"
                                                        value={Math.round((totalAmount.value.quantity / totalAmount.value.accuracy) * 10000) / 10000}
                                                        displayType={"text"}
                                                        thousandSeparator=" "
                                                        decimalSeparator=","
                                                    />
                                                </h1>
                                                <div className="w-6 flex justify-center">
                                                    <Icon name={totalAmount.currency} folder="currency" />
                                                </div>
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
                                    className="p-0 w-72 bg-muted border border-neutral-80 z-[1000]">
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
                                                {merchantOnly
                                                    ? translate("app.ui.roles.merchant")
                                                    : translate("app.ui.roles.admin")}
                                            </div>
                                            {
                                                //TODO: Set valid email
                                            }
                                            {identity.data.email ? (
                                                <div className="text-note-2 cursor-default">{identity.data.email}</div>
                                            ) : (
                                                <></>
                                            )}
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
                                        className="pl-4 pr-4 h-[50px] hover:bg-green-50 hover:cursor-pointer text-title-2"
                                        onClick={handleLogout}>
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
                            <LangSwitcher />
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
                                            {showCaptions ? (
                                                <span className="animate-in fade-in-0 transition-opacity">
                                                    {getResLabel(resources[resource].name, permissions)}
                                                </span>
                                            ) : null}
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

                <div className="bg-muted grow overflow-y-auto scrollbar-stable transition-[margin-left] relative">
                    <main className={`p-6 pr-4 container ${resourceName[0] == "error" ? "h-full" : ""}`}>
                        {resourceName[0] !== "bank-transfer" && resourceName[0] !== "error" && (
                            <h1 className="text-3xl mb-6">{pageTitle}</h1>
                        )}
                        {children}
                    </main>
                </div>
            </div>

            <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
        </div>
    );
};
