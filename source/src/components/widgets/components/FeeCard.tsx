import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { feesDataProvider, FeesResource } from "@/data";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

interface FeeCardProps {
    account: string;
    feeAmount: number;
    feeType: string;
    currency: string;
    resource: FeesResource;
    id: string;
    description?: string;
    innerId?: string;
    deleteFunction?: (innerId: string) => void;
}
export const FeeCard = (props: FeeCardProps) => {
    const { account, feeAmount, feeType, currency, id, resource, description = "", innerId, deleteFunction } = props;
    const translate = useTranslate();
    const refresh = useRefresh();

    const feeDataProvider = feesDataProvider({ resource, id });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClicked = () => {
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (innerId && deleteFunction) {
            deleteFunction(innerId);
        } else {
            try {
                await feeDataProvider.removeFee(account);
                await refresh();
                setDeleteDialogOpen(false);
            } catch (error) {
                // TODO
            }
        }
    };
    return (
        <>
            <div className="mb-[16px]">
                <div className="bg-neutral-0 border border-neutral-70 rounded-[8px] px-[8px] pt-[16px] pb-[8px]">
                    <div className="w-full grid grid-cols-2 gap-y-[8px]">
                        <div className="flex flex-col gap-[4px] w-1/2">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.accountNumber")}
                            </Label>
                            <TextField copyValue text={account} />
                        </div>
                        <div className="flex flex-col gap-[4px] w-1/2">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.feeAmount")}
                            </Label>
                            <TextField text={String(feeAmount)} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <Label className="text-title-1 text-neutral-40" htmlFor="">
                                {translate("resources.direction.fees.feeType")}
                            </Label>
                            <TextField text={String(feeType)} />
                        </div>
                        <div className="flex flex-col gap-[4px]">
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
                        <Button variant={"deleteGray"} onClick={innerId ? handleDelete : handleDeleteClicked}>
                            {translate("app.ui.actions.delete")}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="">
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="w-[251px] bg-muted !z-[200]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">
                                {translate("resources.direction.fees.deleteFee")}
                            </AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex justify-around w-full">
                                <Button onClick={handleDelete}>{translate("app.ui.actions.delete")}</Button>
                                <AlertDialogCancel>{translate("app.ui.actions.cancel")}</AlertDialogCancel>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};
