import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetIdentity, usePermissions, useTranslate } from "react-admin";
import { useMemo, useState } from "react";
import { EllipsisVerticalIcon, LogOut, Settings } from "lucide-react";
import Blowfish from "@/lib/icons/Blowfish";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { HeaderButton } from "@/components/ui/Button";
import { BalanceDisplay } from "./BalanceDisplay";
import { BalanceList } from "./BalanceList";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AccountsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

export const ProfileDropdown = ({ handleLogout }: { handleLogout: () => void }) => {
    const { permissions } = usePermissions();
    const identity = useGetIdentity();
    const translate = useTranslate();
    const [profileOpen, setProfileOpen] = useState(false);
    const isMerchant = useMemo(() => permissions === "merchant", [permissions]);
    const navigate = useNavigate();

    const { isLoading: totalLoading, data: totalAmount } = useQuery<AccountBalance[]>({
        queryKey: ["totalAmount"],
        queryFn: async ({ signal }) => {
            const response = await AccountsDataProvider.balanceCount(signal);

            if (!response.ok) throw new Error(translate("app.ui.header.totalError"));

            const json = await response.json();

            if (!json.success) throw new Error(translate("app.ui.header.totalError"));

            return json.data;
        },
        retry: 2,
        staleTime: 1000 * 60 * 5
    });

    return (
        <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen} modal>
            <div
                className={cn(
                    "box-border flex cursor-default items-center justify-center gap-4 rounded-4 border py-1 pl-4 pr-4",
                    profileOpen
                        ? `border-green-40 bg-muted dark:border-[1px] dark:border-neutral-20`
                        : `cursor-default border-green-20 bg-white dark:border-muted dark:bg-muted`
                )}>
                <DropdownMenuTrigger asChild>
                    <Avatar className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center border-2 border-green-40 bg-muted">
                        <Blowfish />
                    </Avatar>
                </DropdownMenuTrigger>

                <BalanceDisplay
                    totalAmount={totalAmount}
                    isMerchant={isMerchant}
                    identity={identity.data}
                    totalLoading={totalLoading}
                />

                <DropdownMenuTrigger>
                    <EllipsisVerticalIcon
                        className={
                            profileOpen
                                ? "text-green-50 dark:text-green-40"
                                : "text-green-60 hover:text-green-50 dark:text-white dark:hover:text-green-40"
                        }
                    />
                </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent
                sideOffset={34}
                align="end"
                alignOffset={-18}
                className="z-[1000] flex w-72 flex-col gap-2 !rounded-4 border border-green-20 bg-green-0 p-0 dark:border-neutral-20 dark:bg-muted">
                <div className="mt-[0.8rem] flex content-start items-center pl-4 pr-4">
                    <Avatar className="h-5 w-5">
                        <AvatarFallback className="cursor-default bg-green-50 text-primary text-white">
                            {identity.data?.fullName?.[0].toUpperCase() ?? ""}
                        </AvatarFallback>
                    </Avatar>

                    <div className="ml-3">
                        <div className="text-title-1 text-neutral-90 dark:text-white">
                            {isMerchant ? translate("app.ui.roles.merchant") : translate("app.ui.roles.admin")}
                        </div>

                        {identity.data?.email && (
                            <div className="text-note-2 text-neutral-60 dark:text-neutral-50">
                                {identity.data?.email}
                            </div>
                        )}
                    </div>
                </div>

                <BalanceList totalAmount={totalAmount} isMerchant={isMerchant} totalLoading={totalLoading} />

                <ThemeSwitcher />

                <div>
                    <HeaderButton
                        text={translate("app.ui.header.settings")}
                        Icon={Settings}
                        onClick={() => {
                            setProfileOpen(false);
                            navigate("/settings");
                        }}
                    />

                    <HeaderButton text={translate("app.login.logout")} Icon={LogOut} onClick={handleLogout} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
