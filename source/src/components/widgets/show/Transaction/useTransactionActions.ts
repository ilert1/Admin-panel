import { useTranslate, usePermissions, useRefresh } from "react-admin";
import { API_URL } from "@/data/base";
import { useMemo, useCallback, useState } from "react";
import { useErrorToast } from "@/components/ui/toast/useErrorToast";
import { useSuccessToast } from "@/components/ui/toast/useSuccessToast";

const MONEYGATE_URL = import.meta.env.VITE_MONEYGATE_URL;

export const useTransactionActions = (data: Dictionaries.DataObject, record: Transaction.Transaction | undefined) => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const refresh = useRefresh();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const errorToast = useErrorToast();
    const successToast = useSuccessToast();

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
            body: JSON.stringify({ id: record?.id, dispute: !record?.dispute }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    successToast(
                        record?.dispute
                            ? translate("resources.transactions.show.disputeClosed")
                            : translate("resources.transactions.show.disputeOpened")
                    );
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                errorToast(e.message);
            })
            .finally(() => {
                refresh();
            });
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

    const showState = useMemo(() => adminOnly, [adminOnly]);
    const switchState = useCallback(
        (state: number) => {
            fetch(`${API_URL}/trn/man_set_state`, {
                method: "POST",
                body: JSON.stringify({ id: record?.id, state }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            })
                .then(resp => resp.json())
                .then(json => {
                    if (json.success) {
                        const currentState = states.find(item => item.state_int === state);
                        successToast(
                            `${translate("resources.transactions.fields.state.state_changed")} ${
                                currentState?.state_description
                            }`
                        );
                    } else {
                        throw new Error(json.error || "Unknown error");
                    }
                })
                .catch(e => {
                    errorToast(e.message);
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
            body: JSON.stringify({ id: record?.id }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    successToast(translate("resources.transactions.fields.committed"));
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .catch(e => {
                errorToast(e.message);
            })
            .finally(() => {
                refresh();
            });
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps
    const commitCaption = translate("resources.transactions.show.commit");

    const [sendWebhookLoading, setSendWebhookLoading] = useState(false);
    const sendWebhookHandler = useCallback(() => {
        setSendWebhookLoading(true);

        fetch(`${MONEYGATE_URL}/send-callback?id=${record?.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    successToast(
                        translate(
                            translate("resources.transactions.show.sendWebhookSuccessMsg", { id: json.blowfish_id })
                        )
                    );
                    refresh();
                } else {
                    throw new Error(json.error || "Unknown error");
                }
            })
            .then(() => {})
            .catch(e => {
                errorToast(e.message);
            })
            .finally(() => {
                setSendWebhookLoading(false);
            });
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        switchDispute,
        showDispute,
        disputeCaption,
        showState,
        switchState,
        states,
        showCommit,
        commitCaption,
        commitTransaction,
        sendWebhookHandler,
        sendWebhookLoading
    };
};
