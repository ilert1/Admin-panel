import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { feesDataProvider, FeesResource } from "@/data";
import { useState } from "react";
import { HttpError, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface FeeCardProps {
    account: string;
    feeAmount: number;
    feeType: string;
    currency: string;
    resource: FeesResource;
    id: string;
    description?: string;
    addFee?: boolean;
    providerName?: string;
    isInner?: boolean;
    deleteFn?: (innerId: number) => void;
}
export const FeeCard = (props: FeeCardProps) => {
    const {
        account,
        feeAmount,
        feeType,
        currency,
        id,
        addFee,
        resource,
        description = "",
        isInner = false,
        deleteFn,
        providerName
    } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const feeDataProvider = feesDataProvider({ resource, id, providerName: providerName });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (isInner && deleteFn) {
            deleteFn(Number(id));
            return;
        }
        try {
            await feeDataProvider.removeFee(account);

            appToast("success", translate("resources.direction.fees.successDelete"));
            refresh();
            setDeleteDialogOpen(false);
        } catch (error) {
            if (error instanceof HttpError) appToast("error", error.message);
        }
    };
    return (
        <>
            <div className="mt-[2px] mb-[16px]">
                <div className="bg-neutral-10 dark:bg-muted rounded-[8px] px-4 pt-[16px] pb-[8px]">
                    <div className="w-full grid grid-cols-2 gap-y-[8px] gap-2">
                        <TextField
                            copyValue
                            text={account}
                            label={translate("resources.direction.fees.accountNumber")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={String(feeAmount)}
                            label={translate("resources.direction.fees.feeAmount")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={String(feeType)}
                            label={translate("resources.direction.fees.feeType")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={String(currency)}
                            label={translate("resources.direction.fees.currency")}
                            labelSize="text-xs"
                        />
                        {description && (
                            <div className="flex flex-col gap-[4px] col-span-2">
                                <Label
                                    className="text-note-1 !text-neutral-60 dark:!text-neutral-60"
                                    variant="note-1"
                                    htmlFor="">
                                    {translate("resources.direction.fees.descr")}
                                </Label>
                                <Textarea
                                    readOnly
                                    className="!text-body resize-none dark:bg-muted"
                                    value={description}
                                />
                            </div>
                        )}
                    </div>
                    {addFee && (
                        <div className="flex justify-end mt-6 pb-2">
                            <Button variant={"outline_gray"} onClick={handleDeleteClicked}>
                                {translate("app.ui.actions.delete")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="">
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="rounded-16 max-h-56 xl:max-h-none h-auto w-[251px] bg-muted !z-[200] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                {translate("resources.direction.fees.deleteFee")}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <div className="flex justify-around w-full">
                                <Button
                                    onClick={() => {
                                        handleDelete();
                                        setDeleteDialogOpen(false);
                                    }}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                    }}
                                    variant="outline_gray">
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};
