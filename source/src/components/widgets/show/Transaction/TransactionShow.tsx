import { useTranslate, useGetManyReference, usePermissions } from "react-admin";
import { SimpleTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock } from "@/components/ui/loading";
import { TableTypes } from "../../shared/SimpleTable";
import fetchDictionaries from "@/helpers/get-dictionaries";
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
import { useFetchMerchants } from "@/hooks";
import { useGetTransactionShowColumns } from "./Columns";
import clsx from "clsx";
import { useAbortableShowController } from "@/hooks/useAbortableShowController";

interface TransactionShowProps {
    id: string;
}

export const TransactionShow = ({ id }: TransactionShowProps) => {
    const data = fetchDictionaries();
    const translate = useTranslate();

    const { permissions } = usePermissions();
    const context = useAbortableShowController<Transaction.Transaction>({ resource: "transactions", id });
    const [newState, setNewState] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
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
    } = useTransactionActions(data, context.record);

    const { feesColumns, briefHistory } = useGetTransactionShowColumns();

    const trnId = useMemo<string>(() => context.record?.id || "", [context]);

    const { data: history } = useGetManyReference("transactions", {
        target: "id",
        id: trnId
    });

    const { isLoading, merchantsList } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        permissions === "admin" ? useFetchMerchants() : { isLoading: false, merchantsList: [] };

    const merchantNameGenerate = useCallback(
        (type: number, source: string, destination: string) => {
            const sourceMerch = merchantsList.find(el => el.id === source);
            const destMerch = merchantsList.find(el => el.id === destination);

            switch (type) {
                case 1:
                    return destMerch?.name || "";
                case 2:
                case 4:
                    return sourceMerch?.name || "";
                case 3:
                    return `${sourceMerch?.name} - ${destMerch?.name}`;
                default:
                    return "";
            }
        },
        [merchantsList]
    );

    if (context.isLoading || context.isFetching || !context.record || isLoading) {
        return <LoadingBlock />;
    }

    return (
        <div className="top-[82px] flex h-full flex-col gap-6 overflow-auto p-4 pt-0 md:p-[42px]">
            {permissions === "admin" && (
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
                    )}

                    <div className="flex gap-3 md:gap-6">
                        {showDispute && (
                            <Button disabled={!context.record?.state.final} onClick={switchDispute}>
                                {disputeCaption}
                            </Button>
                        )}

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

                        {permissions === "admin" && (
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
                        `resources.transactions.states.${context.record.state.state_description.toLowerCase()}`
                    )}
                />

                {permissions === "admin" && (
                    <TextField
                        label={translate("resources.transactions.fields.destination.header")}
                        text={merchantNameGenerate(
                            context.record?.type,
                            context.record?.source?.id,
                            context.record?.destination?.id
                        )}
                    />
                )}
            </div>

            <SimpleTable
                columns={briefHistory}
                data={history ? history : []}
                tableType={TableTypes.COLORED}
                className={clsx("flex-shrink-1 h-auto min-h-24", history && history.length > 1 && "min-h-48")}
            />

            {(permissions === "admin" ||
                (permissions === "merchant" && context.record.committed && context.record.state.state_int === 16)) && (
                <div className="flex flex-col gap-2">
                    <span>{translate("resources.transactions.fields.fees")}</span>

                    <SimpleTable
                        columns={feesColumns}
                        data={
                            permissions === "admin"
                                ? context.record.fees
                                : context.record.fees.filter(
                                      item =>
                                          (item.type === 1 && item.direction === 1) ||
                                          (item.type === 2 && item.direction === 2)
                                  )
                        }
                        tableType={TableTypes.COLORED}
                        className={clsx(
                            "flex-shrink-1 auto h-auto min-h-20",
                            context.record.fees.length > 1 && "min-h-44"
                        )}
                    />
                </div>
            )}
        </div>
    );
};
