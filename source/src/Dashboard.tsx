import { useMemo } from "react";
import { usePermissions } from "react-admin";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const { isLoading, permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const navigate = useNavigate();

    if (isLoading) return null;

    return adminOnly ? navigate("/transactions") : navigate("/accounts");
};
