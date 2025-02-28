import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useShowController, useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../components/CloseSheetXButton";
import { TextField } from "@/components/ui/text-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { useTransactionActions } from "@/hooks";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useState } from "react";
import { TransactionShow } from "../Transaction";

export interface TransactionShowDialogProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}
export const TransactionShowDialog = (props: TransactionShowDialogProps) => {
    const { id, open, onOpenChange } = props;
    const translate = useTranslate();
    const data = fetchDictionaries();
    const context = useShowController<Transaction.Transaction>({ resource: "transactions", id });

    const { states, showCommit, commitCaption, commitTransaction, switchState } = useTransactionActions(
        data,
        context?.record
    );

    const [newState, setNewState] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

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
                {/* <div className="px-[12px]">
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
                                        placeholder={translate("resources.transactions.fields.state.state_description")}
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
                    </div>
                </div> */}
                <TransactionShow id={id} />
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
