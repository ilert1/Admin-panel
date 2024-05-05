import {
    CoreLayoutProps,
    useGetIdentity,
    useGetResourceLabel,
    useLogout,
    usePermissions,
    useResourceDefinitions,
    useTranslate
} from "react-admin";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useMemo, createElement } from "react";
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
import { CreditCard as CreditCardIcon, HandCoins as HandCoinsIcon, PanelLeft as PanelLeftIcon } from "lucide-react";

export const MainLayout = ({ children, title }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const location = useLocation();
    const resourceName = useMemo(
        () => location.pathname?.split("/")?.filter((s: string) => s?.length > 0)?.[0],
        [location]
    );
    const resourceLabel = useMemo(() => {
        if (resourceName) {
            return translate(`resources.${resourceName}.name`, { smart_count: 2 });
        } else {
            return null;
        }
    }, [resourceName]); // eslint-disable-line react-hooks/exhaustive-deps

    const identity = useGetIdentity();
    const logout = useLogout();

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
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
                                <TooltipContent side="right">
                                    {getResourceLabel(resources[resource].name)}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {adminOnly && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <NavLink
                                        to="/payin"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                        <CreditCardIcon />
                                        <span className="sr-only">{translate("app.menu.payin")}</span>
                                    </NavLink>
                                </TooltipTrigger>
                                <TooltipContent side="right">{translate("app.menu.payin")}</TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink
                                    to="/payout"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                                    <HandCoinsIcon />
                                    <span className="sr-only">{translate("app.menu.payout")}</span>
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">{translate("app.menu.payout")}</TooltipContent>
                        </Tooltip>
                    </nav>
                </aside>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 sm:z-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline" className="sm:hidden">
                                    <PanelLeftIcon className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="sm:max-w-xs">
                                <nav className="grid gap-6 text-lg font-medium">
                                    {Object.keys(resources).map(resource => (
                                        <NavLink
                                            key={resource}
                                            to={`/${resource}`}
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                            {createElement(resources[resource].icon, {
                                                className: "h-5 w-5"
                                            })}
                                            {getResourceLabel(resources[resource].name)}
                                        </NavLink>
                                    ))}
                                    {adminOnly && (
                                        <NavLink
                                            to="/payin"
                                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                            <CreditCardIcon className="h-5 w-5" />
                                            {translate("app.menu.payin")}
                                        </NavLink>
                                    )}
                                    <NavLink
                                        to="/payout"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                                        <HandCoinsIcon className="h-5 w-5" />
                                        {translate("app.menu.payout")}
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
                                {resourceLabel && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink asChild>
                                                <NavLink to={`/${resourceName}`}>{resourceLabel}</NavLink>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        {identity?.data && (
                            <div className="relative ml-auto">
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
                    <main className="p-4 sm:px-6 sm:py-0">{children}</main>
                </div>
            </div>
        </TooltipProvider>
    );
};
