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
import { feesDataProvider, FeesResource } from "@/data";
import { memo, useState } from "react";
import { HttpError, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Trash2 } from "lucide-react";

interface FeeCardProps {
    account: string;
    feeAmount: number;
    feeType: string;
    feeDirection: string;
    resource: FeesResource;
    id: string;
    description?: string;
    addFee?: boolean;
    providerName?: string;
    isInner?: boolean;
    deleteFn?: (innerId: number) => void;
}
export const FeeCard = memo((props: FeeCardProps) => {
    const {
        account,
        feeAmount,
        feeType,
        feeDirection,
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
                <div className="relative bg-neutral-10 dark:bg-muted p-4 pr-11 rounded-8">
                    <div className="gap-2 gap-y-[8px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
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
                            text={String(feeDirection)}
                            label={translate("resources.direction.fees.direction")}
                            labelSize="text-xs"
                        />

                        {description && (
                            <div className="flex flex-col col-span-1 sm:col-span-2">
                                <Label
                                    className="mb-0 !text-neutral-60 text-note-1 dark:!text-neutral-60"
                                    variant="note-1"
                                    htmlFor="">
                                    {translate("resources.direction.fees.descr")}
                                </Label>
                                <p className="dark:bg-muted p-0 border-none !text-body resize-none">{description}</p>
                            </div>
                        )}
                    </div>
                    {addFee && (
                        <Button
                            onClick={handleDeleteClicked}
                            variant="text_btn"
                            className="top-5 right-3 absolute bg-transparent p-0 w-6 h-6">
                            <Trash2 className="w-4 h-4 text-red-40 hover:text-red-30 active:text-red-50" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="">
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="!z-[200] bg-muted rounded-16 w-[251px] h-auto max-h-56 xl:max-h-none overflow-hidden">
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
});
FeeCard.displayName = "FeeCard";
