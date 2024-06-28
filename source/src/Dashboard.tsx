import { HandCoinsIcon, WalletIcon, ReceiptIcon, BitcoinIcon } from "lucide-react";
import { useTranslate } from "react-admin";
import { Link } from "react-admin";

export const Dashboard = () => {
    const translate = useTranslate();
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
                <BitcoinIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.withdraw")}</p>
            </Link>
            {/* <Link
                to="/payin"
                className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                <CreditCardIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.payin")}</p>
            </Link> */}
            <Link
                to="/payout"
                className="flex w-full flex-col items-center rounded-xl border bg-card p-6 !text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10">
                <HandCoinsIcon className="h-10 w-10" />
                <p className="font-medium mt-2">{translate("app.menu.payout")}</p>
            </Link>
        </div>
    );
};
