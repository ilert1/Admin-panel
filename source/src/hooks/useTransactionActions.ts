import { useRecordContext, useTranslate, usePermissions, useRefresh } from "react-admin";
import { API_URL } from "@/data/base";
import { useMemo } from "react";
import { toast } from "sonner";

export const useTransactionActions = (data: any) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const refresh = useRefresh();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const success = (message: string) => {
        toast.success(translate("resources.transactions.show.success"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const error = (message: string) => {
        toast.error(translate("resources.transactions.show.error"), {
            dismissible: true,
            description: message,
            duration: 3000
        });
    };

    const showDispute = useMemo(() => adminOnly, [adminOnly]);
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
                    success(
                        record.dispute
                            ? translate("resources.transactions.show.disputeClosed")
                            : translate("resources.transactions.show.disputeOpened")
                    );
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                error(e.message);
            })
            .finally(() => {
                refresh();
            });
    };

    const showState = useMemo(() => adminOnly, [adminOnly]);
    const stateCaption = translate("resources.transactions.show.statusButton");
    const switchState = (state: number) => {
        fetch(`${API_URL}/trn/man_set_state`, {
            method: "POST",
            body: JSON.stringify({ id: record.id, state }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    success(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                error(e.message);
            })
            .finally(() => {
                refresh();
            });
    };
    const states = useMemo(
        () => (data?.states ? Object.keys(data?.states).map(key => data?.states[key]) || [] : []),
        [data?.states]
    );

    const showCommit = useMemo(() => adminOnly, [adminOnly]);
    const commitTransaction = () => {
        fetch(`${API_URL}/trn/commit`, {
            method: "POST",
            body: JSON.stringify({ id: record.id }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    success(translate("resources.transactions.show.success"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                error(e.message);
            })
            .finally(() => {
                refresh();
            });
    };
    const commitCaption = translate("resources.transactions.show.commit");

    const showStorno = useMemo(() => adminOnly && !record?.dispute, [adminOnly, record]);
    const stornoCaption = translate("resources.transactions.show.storno");

    return {
        switchDispute,
        showDispute,
        disputeCaption,
        showState,
        switchState,
        stateCaption,
        states,
        showCommit,
        commitCaption,
        commitTransaction,
        showStorno,
        stornoCaption
    };
};
