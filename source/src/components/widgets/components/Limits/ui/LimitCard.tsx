import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";
import { useState } from "react";
import { DeleteLimitsDialog } from "./DeleteLimitsDialog";
import { getMaxValue, getMinValue } from "../model/helpers/minmaxValue";

interface LimitCardProps {
    directionId: string;
    limits: Limits;
    setEditClicked: (state: boolean) => void;
}

export const LimitCard = (props: LimitCardProps) => {
    const { limits, directionId, setEditClicked } = props;
    const [deleteClicked, setDeleteClicked] = useState(false);

    const translate = useTranslate();

    const handleDelete = () => {
        setDeleteClicked(true);
    };

    return (
        <>
            <div className="flex flex-col gap-4 bg-muted p-4 rounded-8 mb-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
                    <div className="flex flex-col gap-2 flex-1">
                        <TextField text={translate("app.widgets.limits.deposit")} />
                        <div className="flex gap-2 flex-col">
                            <TextField text={getMinValue(limits.payin)} label="min" />
                            <TextField text={getMaxValue(limits.payin)} label="max" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <TextField text={translate("app.widgets.limits.payment")} />
                        <div className="flex gap-2 flex-col">
                            <TextField text={getMinValue(limits.payout)} label="min" />
                            <TextField text={getMaxValue(limits.payout)} label="max" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <TextField text={translate("app.widgets.limits.reward")} />
                        <div className="flex gap-2 flex-col">
                            <TextField text={getMinValue(limits.reward)} label="min" />
                            <TextField text={getMaxValue(limits.reward)} label="max" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-[10px]">
                    <Button variant="outline" onClick={() => setEditClicked(true)}>
                        {translate("app.ui.actions.edit")}
                    </Button>
                    <Button variant="outline_gray" onClick={handleDelete}>
                        {translate("app.widgets.limits.reset")}
                    </Button>
                </div>
            </div>
            <DeleteLimitsDialog id={directionId} open={deleteClicked} onOpenChange={setDeleteClicked} />
        </>
    );
};
