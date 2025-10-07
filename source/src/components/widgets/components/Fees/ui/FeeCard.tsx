import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { feesDataProvider, FeesResource } from "@/data";
import { memo, useEffect, useState } from "react";
import { HttpError, useRefresh, useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Trash2 } from "lucide-react";
import { useFetchDictionaries } from "@/hooks";
import Big from "big.js";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FeeCardProps {
    account: string;
    feeAmount: number;
    feeType: 1 | 2 | 3;
    currency: string;
    resource: FeesResource;
    id: string | number;
    description?: string;
    addFee?: boolean;
    isInner?: boolean;
    deleteFn?: (innerId: number) => void;
    direction: number;
    disabled?: boolean;
    disabledMessage?: string;
}
export const FeeCard = memo((props: FeeCardProps) => {
    const {
        account,
        feeAmount,
        feeType,
        id,
        currency,
        addFee,
        resource,
        description = "",
        isInner = false,
        deleteFn,
        direction,
        disabled = false,
        disabledMessage = ""
    } = props;
    const feeTypesMap = { 1: "FeeFromSender", 2: "FeeFromTransaction", 3: "FeeFixWithdraw" };
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const [directionText, setDirectionText] = useState("");
    const data = useFetchDictionaries();

    const feeDataProvider = feesDataProvider({ resource, id: String(id) });

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

    useEffect(() => {
        if (data) {
            const directionText = Object.entries(data.transactionTypes).find(el => el[1].type === direction);
            if (directionText) setDirectionText(directionText[1].type_descr);
        }
    }, [data, direction]);

    const accurateFeeAmount = new Big(feeAmount).times(100).toString();

    return (
        <>
            <div className="mb-[16px] mt-[2px]">
                <div className="relative rounded-[8px] bg-neutral-10 px-4 pb-5 pt-[16px] dark:bg-muted">
                    <div className="grid w-full grid-cols-2 gap-2 gap-y-[8px]">
                        <TextField
                            copyValue
                            text={account}
                            label={translate("resources.direction.fees.accountNumber")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={accurateFeeAmount}
                            label={translate("resources.direction.fees.feeAmount")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={feeTypesMap[feeType]}
                            label={translate("resources.direction.fees.feeType")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={currency}
                            label={translate("resources.direction.fees.currency")}
                            labelSize="text-xs"
                        />
                        <TextField
                            text={directionText}
                            label={translate("resources.direction.fees.direction")}
                            labelSize="text-xs"
                        />

                        {description && (
                            <TextField
                                text={description}
                                label={translate("resources.direction.fees.descr")}
                                linesCount={5}
                                lineClamp
                            />
                        )}
                    </div>
                    {addFee && (
                        <TooltipProvider>
                            <Tooltip open={!disabled ? false : undefined} delayDuration={200}>
                                <TooltipTrigger role="none" asChild>
                                    <div className="absolute right-3 top-5 h-6 w-6">
                                        <Button
                                            disabled={disabled}
                                            onClick={handleDeleteClicked}
                                            variant="text_btn"
                                            className="h-6 w-6 bg-transparent p-0">
                                            <Trash2
                                                className={`h-4 w-4 text-red-40 hover:text-red-30 active:text-red-50 ${disabled && "!text-neutral-70"}`}
                                            />
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {disabledMessage && (
                                    <TooltipContent collisionPadding={10}>
                                        <p>{disabledMessage}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            <div className="">
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="!z-[200] h-auto max-h-56 !w-[251px] overflow-hidden rounded-16 bg-muted xl:max-h-none">
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                {translate("resources.direction.fees.deleteFee")}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <div className="flex w-full justify-around">
                                <Button
                                    onClick={() => {
                                        handleDelete();
                                        setDeleteDialogOpen(false);
                                    }}>
                                    {translate("app.ui.actions.delete")}
                                </Button>
                                <Button
                                    className="bg-neutral-0 dark:bg-neutral-100"
                                    variant={"outline"}
                                    onClick={() => {
                                        setDeleteDialogOpen(false);
                                    }}>
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
