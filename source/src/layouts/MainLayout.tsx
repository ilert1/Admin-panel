import {
    CoreLayoutProps,
    useGetResourceLabel,
    usePermissions,
    useResourceDefinitions,
    useTranslate
} from "react-admin";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import { useMemo } from "react";

export const MainLayout = ({ children, title }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    return (
        <div className="w-full min-h-screen h-screen">
            <NavigationMenu>
                <NavigationMenuList>
                    {Object.keys(resources).map(resource => (
                        <NavigationMenuItem key={resource}>
                            <NavLink to={`/${resource}`}>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    {getResourceLabel(resources[resource].name)}
                                </NavigationMenuLink>
                            </NavLink>
                        </NavigationMenuItem>
                    ))}
                    {adminOnly && (
                        <NavigationMenuItem key="payin">
                            <NavLink to="/payin">
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    {translate("app.menu.payin")}
                                </NavigationMenuLink>
                            </NavLink>
                        </NavigationMenuItem>
                    )}
                    <NavigationMenuItem key="payout">
                        <NavLink to="/payout">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                {translate("app.menu.payout")}
                            </NavigationMenuLink>
                        </NavLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div>{title}</div>
            <div>{children}</div>
        </div>
    );
};
