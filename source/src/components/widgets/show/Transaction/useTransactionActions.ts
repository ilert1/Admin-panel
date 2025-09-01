import { useTranslate, usePermissions, useRefresh } from "react-admin";
import { useMemo, useCallback, useState } from "react";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TransactionDataProvider } from "@/data";

export const useTransactionActions = (
    data: Dictionaries.DataObject | undefined,
    record: Transaction.Transaction | undefined
) => {
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const refresh = useRefresh();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const dataProvider = TransactionDataProvider;
    const appToast = useAppToast();

    const showDispute = useMemo(() => adminOnly, [adminOnly]);
    const disputeCaption = useMemo(
        () =>
            record?.dispute
                ? translate("resources.transactions.show.closeDispute")
                : translate("resources.transactions.show.openDispute"),
        [record] // eslint-disable-line react-hooks/exhaustive-deps
    );
    const switchDispute = useCallback(() => {
        if (record)
            dataProvider
                .switchDispute(record)
                .then(json => {
                    if (json.success) {
                        appToast(
                            "success",
                            record?.dispute
                                ? translate("resources.transactions.show.disputeClosed")
                                : translate("resources.transactions.show.disputeOpened")
                        );
                    } else {
                        throw new Error(json.error || "Unknown error");
                    }
                })
                .catch(e => {
                    appToast("error", e.message);
                })
                .finally(() => {
                    refresh();
                });
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

    const showState = useMemo(() => adminOnly, [adminOnly]);
    const switchState = useCallback(
        (state: number) => {
            if (record)
                dataProvider
                    .switchState(state, record)
                    .then(json => {
                        if (json.success) {
                            const currentState = states.find(item => item.state_int === state);
                            appToast(
                                "success",
                                `${translate("resources.transactions.fields.state.state_changed")} ${translate(
                                    `resources.transactions.states.${currentState?.state_description?.toLowerCase()}`
                                )}`
                            );
                        } else {
                            throw new Error(json.error || "Unknown error");
                        }
                    })
                    .catch(e => {
                        appToast("error", e.message);
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
        if (record)
            dataProvider
                .commitTransaction(record)
                .then(json => {
                    if (json.success) {
                        appToast("success", translate("resources.transactions.fields.committed"));
                    } else {
                        throw new Error(json.error || "Unknown error");
                    }
                })
                .catch(e => {
                    appToast("error", e.message);
                })
                .finally(() => {
                    refresh();
                });
    }, [record]); // eslint-disable-line react-hooks/exhaustive-deps
    const commitCaption = translate("resources.transactions.show.commit");

    const [sendWebhookLoading, setSendWebhookLoading] = useState(false);
    const sendWebhookHandler = useCallback(() => {
        setSendWebhookLoading(true);
        if (record)
            dataProvider
                .sendWebhookHandler(record)
                .then(json => {
                    if (json.success) {
                        appToast(
                            "success",
                            translate("resources.transactions.show.sendWebhookSuccessMsg", { id: record.id })
                        );
                        refresh();
                    } else {
                        throw new Error(json.error || "Unknown error");
                    }
                })
                .then(() => {})
                .catch(e => {
                    appToast("error", e.message);
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
