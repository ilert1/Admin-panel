import { useRecordContext, useTranslate, usePermissions, useRefresh } from "react-admin";
import { API_URL, BF_MANAGER_URL } from "@/data/base";
import { useMemo, useCallback } from "react";
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
    const switchDispute = useCallback(() => {
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
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

    const showState = useMemo(() => adminOnly, [adminOnly]);
    const stateCaption = translate("resources.transactions.show.statusButton");
    const switchState = useCallback(
        (state: number) => {
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
        },
        [record] // eslint-disable-line react-hooks/exhaustive-deps
    );
    const states = useMemo(
        () => (data?.states ? Object.keys(data?.states).map(key => data?.states[key]) || [] : []),
        [data?.states]
    );

    const showCommit = useMemo(() => adminOnly, [adminOnly]);
    const commitTransaction = useCallback(() => {
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
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps
    const commitCaption = translate("resources.transactions.show.commit");

    const showStorno = useMemo(() => adminOnly && record?.dispute, [adminOnly, record]);
    const stornoCaption = translate("resources.transactions.show.storno");
    const makeStorno = useCallback(
        (props: { sourceValue: string; destValue: string; source: string; currency: string; destination: string }) => {
            const sourceAccuracy = Math.pow(10, props.sourceValue.split(".")[1]?.length) || 100;
            const destAccuracy = Math.pow(10, props.destValue.split(".")[1]?.length) || 100;
            fetch(`${BF_MANAGER_URL}/v1/manager/storno`, {
                method: "POST",
                body: JSON.stringify({
                    source: {
                        id: props.source,
                        amount: {
                            currency: props.currency,
                            value: {
                                quantity: +props.sourceValue * sourceAccuracy,
                                accuracy: sourceAccuracy
                            }
                        }
                    },
                    destination: {
                        id: props.destination,
                        amount: {
                            currency: "USDT",
                            value: {
                                quantity: +props.destValue * destAccuracy,
                                accuracy: destAccuracy
                            }
                        }
                    },
                    meta: {
                        parentId: record.id
                    }
                }),
                headers: {
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
        },
        [record] // eslint-disable-line react-hooks/exhaustive-deps
    );

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
        stornoCaption,
        makeStorno
    };
};
