import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { feesDataProvider, FeesResource } from "@/data";
import { useTranslate } from "react-admin";

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

    const feeDataProvider = feesDataProvider({ resource, id });

    const handleDelete = () => {
        try {
            feeDataProvider.removeFee(account);
        } catch (error) {
            // TODO
        }
    };

    return (
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
                    <div className="flex flex-col gap-[4px] row-span-2">
                        <Label className="text-title-1 text-neutral-40" htmlFor="">
                            {translate("resources.direction.fees.descr")}
                        </Label>
                        <TextField text={String(description)} />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <Button variant={"deleteGray"} onClick={handleDelete}>
                        {translate("app.ui.actions.delete")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
