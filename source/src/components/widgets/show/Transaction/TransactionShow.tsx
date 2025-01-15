import { useShowController, useTranslate, useGetManyReference, usePermissions } from "react-admin";
import { SimpleTable } from "@/components/widgets/shared";
import { TextField } from "@/components/ui/text-field";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock } from "@/components/ui/loading";
import { TableTypes } from "../../shared/SimpleTable";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

interface TransactionShowProps {
    id: string;
}

export const TransactionShow = ({ id }: TransactionShowProps) => {
    const data = fetchDictionaries();
    const translate = useTranslate();

    const { permissions } = usePermissions();
    const context = useShowController<Transaction.Transaction>({ id });
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
                    return <TextField text={destMerch?.name || ""} wrap />;
                case 2:
                case 4:
                    return <TextField text={sourceMerch?.name || ""} wrap />;
                case 3:
                    return <TextField text={`${sourceMerch?.name} - ${destMerch?.name}`} wrap />;
                default:
                    return <TextField text="" wrap />;
            }
        },
        [merchantsList]
    );

    if (context.isLoading || context.isFetching || !context.record || isLoading) {
        return <LoadingBlock />;
    }

    return (
        <div className="p-[42px] pt-0 flex flex-col gap-6 top-[82px] overflow-auto">
            {permissions === "admin" && (
                <div className={`flex justify-between flex-wrap gap-4`}>
                    {showState && (
                        <div className="flex gap-2 items-center">
                            <TextField text={translate("resources.transactions.fields.state.state_description")} />
                            <Select value={newState} onValueChange={setNewState}>
                                <SelectTrigger className="w-[180px] border-">
                                    <SelectValue
                                        placeholder={translate("resources.transactions.fields.state.state_description")}
                                    />
                                </SelectTrigger>

                                <SelectContent className="bg-neutral-0">
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

                    <div className="flex gap-6">
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

                        {permissions === "admin" && (
                            <Button disabled={sendWebhookLoading} className="min-w-36" onClick={sendWebhookHandler}>
                                {sendWebhookLoading ? (
                                    <LoadingBlock className="w-[20px]" />
                                ) : (
                                    translate("resources.transactions.show.sendWebhook")
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <div className="flex gap-6">
                <div className="flex flex-col">
                    <span className="opacity-60 text-title-1">{translate("resources.transactions.fields.type")}</span>

                    <TextField
                        text={translate(
                            `resources.transactions.types.${data?.transactionTypes[
                                context.record.type
                            ]?.type_descr.toLowerCase()}`
                        )}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="opacity-60 text-title-1">
                        {translate("resources.transactions.fields.state.state_description")}
                    </span>

                    <TextField
                        text={translate(
                            `resources.transactions.states.${context.record.state.state_description.toLowerCase()}`
                        )}
                    />
                </div>

                {permissions === "admin" && (
                    <div className="flex flex-col">
                        <span className="opacity-60 text-title-1">
                            {translate("resources.transactions.fields.destination.header")}
                        </span>

                        <span>
                            {merchantNameGenerate(
                                context.record?.type,
                                context.record?.source?.id,
                                context.record?.destination?.id
                            )}
                        </span>
                    </div>
                )}
            </div>

            <SimpleTable columns={briefHistory} data={history ? history : []} tableType={TableTypes.COLORED} />

            {(permissions === "admin" ||
                (permissions === "merchant" && context.record.committed && context.record.state.state_int === 16)) && (
                <div className="flex flex-col gap-2 min-h-[100px]">
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
                    />
                </div>
            )}
        </div>
    );
};
