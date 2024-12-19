import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { feesDataProvider, FeesResource } from "@/data";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";
import { toast } from "sonner";

interface FeeCardProps {
    account: string;
    feeAmount: number;
    feeType: string;
    currency: string;
    resource: FeesResource;
    id: string;
    description?: string;
}
export const FeeCard = (props: FeeCardProps) => {
    const { account, feeAmount, feeType, currency, id, resource, description = "" } = props;
    const translate = useTranslate();
    const refresh = useRefresh();

    const feeDataProvider = feesDataProvider({ resource, id });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await feeDataProvider.removeFee(account);

            refresh();
            setDeleteDialogOpen(false);
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong",
                dismissible: true,
                duration: 3000
            });
        }
    };
    return (
        <>
            <div className="mt-[2px] mb-[16px]">
                <div className="bg-neutral-0 border border-neutral-70 rounded-[8px] px-[8px] pt-[16px] pb-[8px]">
                    <div className="w-full grid grid-cols-2 gap-y-[8px] gap-2">
                        <div className="flex flex-col gap-[4px] col-span-2 sm:col-span-1">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.accountNumber")}
                            </Label>
                            <TextField copyValue text={account} />
                        </div>
                        <div className="flex flex-col gap-[4px] col-span-2 sm:col-span-1">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.feeAmount")}
                            </Label>
                            <TextField text={String(feeAmount)} />
                        </div>
                        <div className="flex flex-col gap-[4px] col-span-2 sm:col-span-1">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.feeType")}
                            </Label>
                            <TextField text={String(feeType)} />
                        </div>
                        <div className="flex flex-col gap-[4px] col-span-2 sm:col-span-1">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.currency")}
                            </Label>
                            <TextField text={String(currency)} />
                        </div>
                        <div className="flex flex-col gap-[4px] col-span-2">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.descr")}
                            </Label>
                            <Textarea readOnly className="!text-body resize-none" value={description} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button variant={"deleteGray"} onClick={handleDeleteClicked}>
                            {translate("app.ui.actions.delete")}
                        </Button>
                    </div>
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
                                    variant="outline">
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
