import { useRecordContext, useTranslate, usePermissions, useRefresh } from "react-admin";
import { API_URL } from "@/data/base";
import { useMemo } from "react";
import { toast } from "sonner";

export const useTransactionActions = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const { permissions } = usePermissions();

    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const showDispute = useMemo(() => adminOnly, [adminOnly]);

    const refresh = useRefresh();

    const disputeCaption = useMemo(
        () =>
            record?.dispute
                ? translate("resources.transactions.show.closeDispute")
                : translate("resources.transactions.show.openDispute"),
        [record] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const switchDispute = () => {
        fetch(`${API_URL}/trn/dispute`, {
            method: "POST",
            body: JSON.stringify({ id: record.id, dispute: !record.dispute }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    toast.success(translate("resources.transactions.show.success"), {
                        dismissible: true,
                        description: record.dispute
                            ? translate("resources.transactions.show.disputeClosed")
                            : translate("resources.transactions.show.disputeOpened"),
                        duration: 3000
                    });
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                toast.error(translate("resources.transactions.show.error"), {
                    dismissible: true,
                    description: e.message,
                    duration: 3000
                });
            })
            .finally(() => {
                refresh();
            });
    };

    return {
        switchDispute,
        showDispute,
        disputeCaption
    };
};
