import {
    HandCoinsIcon,
    WalletIcon,
    ReceiptIcon,
    WaypointsIcon,
    BitcoinIcon,
    UsersIcon,
    CurrencyIcon,
    StoreIcon,
    PcCaseIcon,
    MilestoneIcon
} from "lucide-react";
import { useMemo } from "react";
import { usePermissions, useTranslate } from "react-admin";
import { Link } from "react-admin";

export const Dashboard = () => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const merchantOnly = useMemo(() => permissions === "merchant", [permissions]);
    return (
        <div className="grid sm:grid-cols-2 gap-4 mt-8 sm:gap-6">
            <Link
                to="/accounts"
                className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                <WalletIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.accounts")}</p>
            </Link>
            <Link
                to="/transactions"
                className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                <ReceiptIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.transactions")}</p>
            </Link>
            <Link
                to="/withdraw"
                className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                <WaypointsIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.withdraw")}</p>
            </Link>
            {merchantOnly && (
                <>
                    <Link
                        to="/bank-transfer"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <HandCoinsIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.bankTransfer")}</p>
                    </Link>
                    <Link
                        to="/crypto-transfer"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <BitcoinIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.cryptoTransfer")}</p>
                    </Link>
                </>
            )}
            {adminOnly && (
                <>
                    <Link
                        to="/users"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <UsersIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.users")}</p>
                    </Link>
                    <Link
                        to="currency"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <CurrencyIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.currencies")}</p>
                    </Link>
                    <Link
                        to="merchant"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <StoreIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.merchant")}</p>
                    </Link>
                    <Link
                        to="provider"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <PcCaseIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.providers")}</p>
                    </Link>
                    <Link
                        to="direction"
                        className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                        <MilestoneIcon className="h-10 w-10" />
                        <p className="font-medium mt-2">{translate("app.menu.directions")}</p>
                    </Link>
                </>
            )}
        </div>
    );
};
