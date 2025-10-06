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
import { MerchantSchema } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useAbortableListController } from "@/hooks/useAbortableListController";
import { getStateByRole } from "@/helpers/getStateByRole";
import { Label } from "@/components/ui/label";
import { PaymentTypeIcon } from "../../components/PaymentTypeIcon";
import { useGetJsonFormDataForTransactions } from "./useGetJsonFormDataForTransactions";
import { EyeIcon } from "lucide-react";
import { TransactionCustomerDataDialog } from "./TransactionCustomerDataDialog";
import { TransactionRequisitesDialog } from "./TransactionRequisitesDialog";
import { SyncDialog } from "./SyncDialog";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

import { TransactionDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

interface TransactionShowProps {
    id: string;
}

export const TransactionShow = ({ id }: TransactionShowProps) => {
    const data = useFetchDictionaries();
    const translate = useTranslate();
    const { openSheet, closeSheet } = useSheets();
    const { permissions } = usePermissions();
    const adminOnly = useMemo(() => permissions === "admin", [permissions]);
    const [requisitesOpen, setRequisitesOpen] = useState(false);
    const [customerDataOpen, setCustomerDataOpen] = useState(false);
    const [syncDialogOpen, setSyncDialogOpen] = useState(false);
    const [view, setView] = useState(false);
    const transactionDataProvider = TransactionDataProvider;

    const { merchantSchema, merchantUISchema, adminSchema, adminUISchema } = useGetJsonFormDataForTransactions();

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

    const { feesColumns, briefHistory, stateUpdateColumns, callbackHistoryColumns } = useGetTransactionShowColumns();

    const trnId = useMemo<string>(() => context.record?.id || "", [context]);

    const { data: history, isLoading: isHistoryLoading } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    const { isMerchantsLoading, merchantData } = useMerchantsListWithoutPagination();

    const getNameAndIdByType = (
        type: number,
        sourceMerch: MerchantSchema | undefined,
        destMerch: MerchantSchema | undefined
    ) => {
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

    const { data: callbackHistory } = useQuery({
        queryKey: ["transactionCallbackHistory", id],
        queryFn: async () => await transactionDataProvider.getTransactionCallbackHistory(id)
    });

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

    const hasRequisitesData = () => {
        if (!adminOnly) return false;

        const requisitesData =
            context.record.type === 1
                ? context.record.source?.requisites?.[0]
                : context.record.destination?.requisites?.[0];

        return requisitesData && Object.values(requisitesData).some(value => !!value);
    };

    const hasCustomerData = () => {
        if (adminOnly) {
            const customerData = context.record.meta?.customer_data;
            return customerData && Object.values(customerData).some(value => !!value);
        } else {
            const customerData = context.record.meta?.customer_data;
            return customerData && Object.values(customerData).some(value => !!value);
        }
    };

    let adminData = {};
    let adminCustomerData = {};

    if (adminOnly) {
        adminData =
            context.record.type === 1
                ? context.record.source?.requisites?.[0]
                : context.record.destination?.requisites?.[0];
        adminCustomerData = context.record.meta?.customer_data;
    }

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

                    <div className="flex flex-wrap gap-3">
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
                            <>
                                <Button className="min-w-36" onClick={() => setSyncDialogOpen(true)}>
                                    {translate("resources.transactions.show.sync")}
                                </Button>
                                <TooltipProvider>
                                    <Tooltip open={!context.record.meta?.common_callback_url ? undefined : false}>
                                        <TooltipTrigger className="!mt-0" role="none" asChild>
                                            <div>
                                                <Button
                                                    disabled={
                                                        sendWebhookLoading || !context.record.meta?.common_callback_url
                                                    }
                                                    className="min-w-36"
                                                    onClick={sendWebhookHandler}>
                                                    {sendWebhookLoading ? (
                                                        <div className="w-[20px]">
                                                            <LoadingBlock />
                                                        </div>
                                                    ) : (
                                                        translate("resources.transactions.show.sendWebhook")
                                                    )}
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent collisionPadding={10}>
                                            <p>{translate("resources.transactions.show.webhookNotAvailable")}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-2">
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
                                        className="max-w-[150px]"
                                        wrap={true}
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

                <div>
                    <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                        {translate("resources.transactions.fields.meta.payment_type")}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {context.record.meta.payment_type ? (
                            <PaymentTypeIcon type={context.record.meta.payment_type} />
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>

                {adminOnly && (
                    <TextField
                        label={translate("resources.transactions.fields.meta.provider")}
                        className="max-w-[150px]"
                        wrap={true}
                        text={context.record.meta.provider ?? "-"}
                    />
                )}
                {adminOnly && (
                    <div className="flex flex-col items-center justify-center">
                        <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                            {translate("resources.transactions.show.transactionData")}
                        </Label>
                        <Button
                            disabled={!hasRequisitesData()}
                            onClick={() => setRequisitesOpen(true)}
                            variant="text_btn"
                            className="flex size-7 h-7 w-7 items-center bg-transparent p-0 text-green-50 hover:text-green-40 disabled:text-neutral-90">
                            <EyeIcon className=" " />
                        </Button>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center">
                    <Label className="text-sm !text-neutral-60 dark:!text-neutral-60">
                        {translate("resources.transactions.show.customerData")}
                    </Label>
                    <Button
                        disabled={!hasCustomerData()}
                        onClick={() => setCustomerDataOpen(true)}
                        variant="text_btn"
                        className="flex size-7 h-7 w-7 items-center bg-transparent p-0 text-green-50 hover:text-green-40 disabled:text-neutral-90">
                        <EyeIcon className=" " />
                    </Button>
                </div>
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
                        history && history.length > 1 && adminOnly && "max-h-96"
                    )}
                />
            )}

            {(adminOnly ||
                (permissions === "merchant" && context.record.committed && context.record.state.state_int === 16)) && (
                <div className="flex flex-col gap-2">
                    <span className="text-display-4">{translate("resources.transactions.fields.fees")}</span>

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
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-display-4">
                            {translate("resources.transactions.callbackHistory.title")}
                        </span>
                        <label className="flex items-center gap-2 self-end">
                            <button
                                onClick={() => setView(!view)}
                                className={clsx(
                                    "flex w-11 items-center rounded-[50px] p-0.5 outline outline-1",
                                    view
                                        ? "bg-neutral-100 outline-transparent dark:bg-green-50 dark:outline-green-40"
                                        : "bg-transparent outline-green-40 dark:outline-green-50"
                                )}>
                                <span
                                    className={clsx(
                                        "h-5 w-5 rounded-full outline outline-1 transition-all",
                                        view
                                            ? "translate-x-full bg-neutral-0 outline-transparent dark:bg-neutral-100 dark:outline-green-40"
                                            : "translate-x-0 bg-green-50 outline-green-40 dark:bg-green-50 dark:outline-transparent"
                                    )}
                                />
                            </button>
                            <p className="text-base text-neutral-90 dark:text-neutral-30">JSON</p>
                        </label>
                    </div>
                    {!view ? (
                        <div className="w-full">
                            <SimpleTable
                                columns={callbackHistoryColumns}
                                data={callbackHistory?.data || []}
                                tableType={TableTypes.COLORED}
                            />
                        </div>
                    ) : (
                        <div className="h-[350px] w-full">
                            <MonacoEditor
                                // code={JSON.stringify(formData?.changes_history, null, 2)}
                                code={JSON.stringify(callbackHistory || "{}", null, 2)}
                                height="h-full"
                                disabled
                            />
                        </div>
                    )}
                </div>
            )}

            {adminOnly && (
                <div className="flex flex-col gap-2 [&_thead_th]:text-sm">
                    <span className="text-display-4">{translate("resources.transactions.stateUpdate.title")}</span>

                    <ListContextProvider value={{ ...listContext }}>
                        <DataTable columns={stateUpdateColumns} />
                    </ListContextProvider>
                </div>
            )}

            <TransactionCustomerDataDialog
                open={customerDataOpen}
                onOpenChange={setCustomerDataOpen}
                schema={merchantSchema}
                uiSchema={merchantUISchema}
                data={adminOnly ? adminCustomerData : context.record.meta.customer_data}
            />
            <TransactionRequisitesDialog
                open={requisitesOpen}
                onOpenChange={setRequisitesOpen}
                schema={adminSchema}
                uiSchema={adminUISchema}
                data={adminData}
            />

            <SyncDialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen} txId={context.record.id} />
        </div>
    );
};
