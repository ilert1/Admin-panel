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
import { Navigate, useNavigate } from "react-router-dom";
export const Dashboard = () => {
    const translate = useTranslate();

    const { isLoading, permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const navigate = useNavigate();

    if (isLoading) return null;

    return adminOnly ? navigate("/transactions") : navigate("/accounts");
};
