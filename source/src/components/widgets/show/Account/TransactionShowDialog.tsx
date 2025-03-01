import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    fetchUtils,
    useGetManyReference,
    usePermissions,
    useRefresh,
    useShowController,
    useTranslate
} from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { TextField } from "@/components/ui/text-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { useTransactionActions } from "@/hooks";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionShow } from "../Transaction";
import { useQuery } from "react-query";
import { API_URL } from "@/data/base";
import { Loading, LoadingBlock } from "@/components/ui/loading";
import { toast } from "sonner";
import { Fees } from "../../components/Fees";
import { SimpleTable } from "../../shared";
import { TableTypes } from "../../shared/SimpleTable";
import { useGetTransactionShowColumns } from "../Transaction/Columns";

export interface TransactionShowDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}
export const TransactionShowDialog = (props: TransactionShowDialogProps) => {
    const { id, open, onOpenChange } = props;
    const translate = useTranslate();
    const data = fetchDictionaries();
    const refresh = useRefresh();
    const { feesColumns } = useGetTransactionShowColumns();

    const { permissions } = usePermissions();

    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const showCommit = useMemo(() => adminOnly, [adminOnly]);
    const commitCaption = translate("resources.transactions.show.commit");

    const states = useMemo(
        () => (data?.states ? Object.keys(data?.states).map(key => data?.states[key]) || [] : []),
        [data?.states]
    );
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

    const [newState, setNewState] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    // const { states, showCommit, commitCaption, commitTransaction, switchState } = useTransactionActions(
    //     data,
    //     context?.record
    // );
    const commitTransaction = useCallback(() => {
        fetch(`${API_URL}/trn/commit`, {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(resp => resp.json())
            .then(json => {
                if (json.success) {
                    success(translate("resources.transactions.fields.committed"));
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
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const switchState = useCallback(
        (state: number) => {
            fetch(`${API_URL}/trn/man_set_state`, {
                method: "POST",
                body: JSON.stringify({ id, state }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`
                }
            })
                .then(resp => resp.json())
                .then(json => {
                    if (json.success) {
                        const currentState = states.find(item => item.state_int === state);
                        success(
                            `${translate("resources.transactions.fields.state.state_changed")} ${
                                currentState?.state_description
                            }`
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
        },
        [id] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const {
        data: queryData,
        isFetching,
        isLoading
    } = useQuery(
        ["getTransaction"],
        async () => {
            const { json } = await fetchUtils.fetchJson(`${API_URL}/transactions/${id}`, {
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
            });

            if (!json.success) {
                console.log("Err");
            }
            return json.data;
        },
        {}
    );

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id
    });

    console.log(queryData);

    if (isFetching) {
        console.log("aa");
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full w-[716px] h-full md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px] gap-[24px]">
                <DialogHeader>
                    <div className="flex flex-col w-full gap-2 p-[12px]">
                        <div className="flex justify-between items-center">
                            <DialogTitle className="!text-display-1">
                                {translate("app.ui.transactionHistory")}
                            </DialogTitle>
                            <CloseSheetXButton onOpenChange={onOpenChange} />
                        </div>
                        <TextField className="!text-display-4 dark:!text-neutral-30" text={id} copyValue />
                    </div>
                    <DialogDescription />
                </DialogHeader>
                {isFetching || isLoading ? (
                    <div className="h-40">
                        <LoadingBlock />
                    </div>
                ) : (
                    <div className="px-[12px] flex flex-col gap-6">
                        <div className="flex gap-6">
                            <TextField text={"aaa"} label="Type" />
                            <TextField text={"aaa"} label="Payee" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                                <TextField text={translate("resources.transactions.fields.state.state_description")} />
                                <Select value={newState} onValueChange={setNewState}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.transactions.fields.state.state_description"
                                            )}
                                        />
                                    </SelectTrigger>

                                    <SelectContent className="bg-neutral-0 !max-h-56">
                                        {states.map(state => (
                                            <SelectItem key={state.state_int} value={state.state_int.toString()}>
                                                {translate(
                                                    `resources.transactions.states.${state?.state_description?.toLowerCase()}`
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button onClick={() => switchState(Number(newState))} disabled={!newState}>
                                    {translate("app.ui.actions.save")}
                                </Button>
                            </div>

                            {showCommit && (
                                <>
                                    <Button
                                        // disabled={!context.record?.state.final}
                                        variant={"default"}
                                        onClick={() => setDialogOpen(true)}>
                                        {commitCaption}
                                    </Button>

                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogContent className="rounded-16 max-h-56 xl:max-h-none h-auto max-w-[350px] overflow-hidden">
                                            <DialogHeader>
                                                <DialogTitle className="text-center">
                                                    {translate("resources.transactions.show.commitTransaction")}
                                                </DialogTitle>
                                                <DialogDescription></DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <div className="flex flex-col sm:flex-row justify-around gap-4 sm:gap-[35px] w-full">
                                                    <Button
                                                        onClick={() => {
                                                            commitTransaction();
                                                            setDialogOpen(false);
                                                        }}
                                                        className="w-full sm:w-40">
                                                        {translate("resources.transactions.show.commit")}
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setDialogOpen(false);
                                                        }}
                                                        variant="outline"
                                                        className="w-full !ml-0 px-3 sm:w-24">
                                                        {translate("app.ui.actions.cancel")}
                                                    </Button>
                                                </div>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </div>

                        <SimpleTable
                            columns={feesColumns}
                            data={
                                permissions === "admin"
                                    ? queryData?.fees
                                    : queryData?.fees.filter(
                                          (item: { type: number; direction: number }) =>
                                              (item.type === 1 && item.direction === 1) ||
                                              (item.type === 2 && item.direction === 2)
                                      )
                            }
                            tableType={TableTypes.COLORED}
                            className="flex-shrink-1 min-h-[15dvh]"
                        />
                    </div>
                )}
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
