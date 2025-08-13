import { useTranslate, useGetManyReference, usePermissions, ListContextProvider } from "react-admin";
import { DataTable, SimpleTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock } from "@/components/ui/loading";
import { TableTypes } from "../../shared/SimpleTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTransactionActions } from "./useTransactionActions";
import { useFetchDictionaries, useMerchantsListWithoutPagination } from "@/hooks";
import { useGetTransactionShowColumns } from "./Columns";
import clsx from "clsx";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";
import { useSheets } from "@/components/providers/SheetProvider";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { getStateByRole } from "@/helpers/getStateByRole";

interface TransactionShowProps {
    id: string;
}

export const TransactionShow = ({ id }: TransactionShowProps) => {
    const data = useFetchDictionaries();
    const translate = useTranslate();
    const { openSheet, closeSheet } = useSheets();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);

    const appToast = useAppToast();

    const context = useAbortableShowController<Transaction.Transaction>({
        resource: "transactions",
        id,
        queryOptions: {
            onError: () => {
                appToast("error", translate("resources.transactions.show.notFound"));
                closeSheet("transaction");
            }
        }
    });

    const listContext = useAbortableListController<Transaction.TransactionStateUpdate>({
        resource: "state_update",
        filter: { id },
        disableSyncWithLocation: true,
        queryOptions: {
            enabled: adminOnly
        }
    });

    const [newState, setNewState] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        // switchDispute,
        // showDispute,
        // disputeCaption,
        showState,
        switchState,
        states,
        showCommit,
        commitCaption,
        commitTransaction,
        sendWebhookHandler,
        sendWebhookLoading
    } = useTransactionActions(data, context.record);

    const { feesColumns, briefHistory, stateUpdateColumns } = useGetTransactionShowColumns();

    const trnId = useMemo<string>(() => context.record?.id || "", [context]);

    const { data: history, isLoading: isHistoryLoading } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    const { isMerchantsLoading, merchantData } = useMerchantsListWithoutPagination();

    const getNameAndIdByType = (type: number, sourceMerch: Merchant | undefined, destMerch: Merchant | undefined) => {
        switch (type) {
            case 1:
                return [{ name: destMerch?.name || "", id: destMerch?.id }];
            case 2:
            case 4:
                return [{ name: sourceMerch?.name || "", id: sourceMerch?.id }];
            case 3:
                return [
                    { name: sourceMerch?.name, id: sourceMerch?.id },
                    { name: destMerch?.name, id: destMerch?.id }
                ];
            default:
                return [];
        }
    };

    const getSourceAndDestMerch = useCallback(
        (source: string, destination: string) => {
            const sourceMerch = merchantData?.find(el => el.id === source);
            const destMerch = merchantData?.find(el => el.id === destination);

            return { sourceMerch, destMerch };
        },
        [merchantData]
    );

    const merchantNameAndIdGenerate = (type: number, source: string, destination: string) => {
        const { destMerch, sourceMerch } = getSourceAndDestMerch(source, destination);

        const res = getNameAndIdByType(type, sourceMerch, destMerch);

        return res;
    };

    if (context.isLoading || context.isFetching || !context.record || isMerchantsLoading) {
        return <LoadingBlock />;
    }

    const merchantsInfo = merchantNameAndIdGenerate(
        context.record?.type,
        context.record?.source?.id,
        context.record?.destination?.id
    );

    return (
        <div className="top-[82px] flex h-full flex-col gap-6 overflow-auto p-4 pt-0 md:px-[42px]">
            {adminOnly && (
                <div className={`flex flex-wrap justify-between gap-4`}>
                    {showState && (
                        <div className="flex items-center gap-2">
                            <TextField text={translate("resources.transactions.fields.state.state_description")} />
                            <Select value={newState} onValueChange={setNewState}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.fields.state.state_description")}
                                    />
                                </SelectTrigger>

                                <SelectContent className="!max-h-56 bg-neutral-0">
                                    {states &&
                                        states.map(
                                            state =>
                                                state.state_int && (
                                                    <SelectItem
                                                        key={state.state_int}
                                                        value={state.state_int.toString()}>
                                                        {translate(
                                                            `resources.transactions.states.${state?.state_description?.toLowerCase()}`
                                                        )}
                                                    </SelectItem>
                                                )
                                        )}
                                </SelectContent>
                            </Select>

                            <Button onClick={() => switchState(Number(newState))} disabled={!newState}>
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-3 md:gap-6">
                        {/* {showDispute && (
                            <Button disabled={!context.record?.state.final} onClick={switchDispute}>
                                {disputeCaption}
                            </Button>
                        )} */}

                        {showCommit && (
                            <>
                                <Button
                                    disabled={!context.record?.state.final}
                                    variant={"default"}
                                    onClick={() => setDialogOpen(true)}>
                                    {commitCaption}
                                </Button>

                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogContent className="h-auto max-h-56 max-w-[350px] overflow-hidden rounded-16 xl:max-h-none">
                                        <DialogHeader>
                                            <DialogTitle className="text-center">
                                                {translate("resources.transactions.show.commitTransaction")}
                                            </DialogTitle>
                                            <DialogDescription></DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-[35px]">
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
                                                    className="!ml-0 w-full px-3 sm:w-24">
                                                    {translate("app.ui.actions.cancel")}
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}

                        {adminOnly && (
                            <Button disabled={sendWebhookLoading} className="min-w-36" onClick={sendWebhookHandler}>
                                {sendWebhookLoading ? (
                                    <div className="w-[20px]">
                                        <LoadingBlock />
                                    </div>
                                ) : (
                                    translate("resources.transactions.show.sendWebhook")
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <div className="flex items-baseline gap-3 md:gap-6">
                <TextField
                    label={translate("resources.transactions.fields.type")}
                    text={translate(
                        `resources.transactions.types.${data?.transactionTypes[
                            context.record.type
                        ]?.type_descr.toLowerCase()}`
                    )}
                />

                <TextField
                    label={translate("resources.transactions.fields.state.state_description")}
                    text={translate(
                        `resources.transactions.${getStateByRole(permissions, data, context.record.state.state_int_ingress, context.record.state.state_int)}`
                    )}
                />
                {adminOnly && (
                    <TextField
                        label={translate(`resources.transactions.fields.state.merchant_state`)}
                        text={
                            translate(
                                `resources.transactions.${getStateByRole("merchant", data, context.record.state.state_int_ingress)}`
                            ) || ""
                        }
                    />
                )}
                <div>
                    <TextField
                        label={translate("resources.transactions.fields.rateInfo")}
                        text={`${context.record.rate_info.s_currency ?? "-"} / ${context.record.rate_info.d_currency ?? "-"}`}
                    />
                    <TextField
                        text={
                            String(context.record.rate_info.value.quantity / context.record.rate_info.value.accuracy) ??
                            ""
                        }
                    />
                </div>

                {adminOnly && (
                    <>
                        {merchantsInfo?.length !== 0 ? (
                            merchantsInfo.map(el => {
                                return (
                                    <TextField
                                        key={`merchant-${el.id}`}
                                        label={translate("resources.transactions.fields.destination.header")}
                                        text={el.name ?? ""}
                                        onClick={
                                            el.name
                                                ? () =>
                                                      openSheet("merchant", {
                                                          id: el.id,
                                                          merchantName: el.name
                                                      })
                                                : undefined
                                        }
                                    />
                                );
                            })
                        ) : (
                            <TextField
                                label={translate("resources.transactions.fields.destination.header")}
                                text={""}
                            />
                        )}
                    </>
                )}
            </div>

            {isHistoryLoading ? (
                <LoadingBlock className="flex-shrink-1 h-auto max-h-72 min-h-24" />
            ) : (
                <SimpleTable
                    columns={briefHistory}
                    data={history ? history : []}
                    tableType={TableTypes.COLORED}
                    className={clsx(
                        "flex-shrink-1 h-auto",
                        !history && "min-h-24",
                        history && history.length > 1 && "min-h-48"
                    )}
                />
            )}

            {(adminOnly ||
                (permissions === "merchant" && context.record.committed && context.record.state.state_int === 16)) && (
                <div className="flex flex-col gap-2">
                    <span>{translate("resources.transactions.fields.fees")}</span>

                    <SimpleTable
                        columns={feesColumns}
                        data={
                            adminOnly
                                ? context.record.fees
                                : context.record.fees.filter(
                                      item =>
                                          (item.type === 1 && item.direction === 1) ||
                                          (item.type === 2 && item.direction === 2)
                                  )
                        }
                        tableType={TableTypes.COLORED}
                        className={clsx(
                            "flex-shrink-1 auto h-auto",
                            !context.record.fees && "min-h-20",
                            context.record.fees?.length > 1 && "min-h-44"
                        )}
                    />
                </div>
            )}

            {adminOnly && (
                <div className="flex flex-col gap-2 [&_thead_th]:text-sm">
                    <span>{translate("resources.transactions.stateUpdate.title")}</span>

                    <ListContextProvider value={{ ...listContext }}>
                        <DataTable columns={stateUpdateColumns} />
                    </ListContextProvider>
                </div>
            )}
        </div>
    );
};
