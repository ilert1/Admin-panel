import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";
// import { useState } from "react";
// import { DeleteLimitsDialog } from "./DeleteLimitsDialog";
import { getMaxValue, getMinValue } from "../model/helpers/minmaxValue";

interface LimitCardProps {
    directionId: string;
    limits: Limits;
    setEditClicked: (state: boolean) => void;
    disabled?: boolean;
}

export const LimitCard = (props: LimitCardProps) => {
    const {
        limits,
        // directionId,
        setEditClicked,
        disabled = false
    } = props;
    // const [deleteClicked, setDeleteClicked] = useState(false);

    const translate = useTranslate();

    // const handleDelete = () => {
    //     setDeleteClicked(true);
    // };

    return (
        <>
            <div className="mb-4 flex flex-col gap-4 rounded-8 bg-neutral-10 p-4 dark:bg-muted">
                <div className="items-left flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 flex-col gap-1 sm:gap-2">
                        <TextField text={translate("app.widgets.limits.deposit")} />
                        <div className="flex flex-row gap-2 sm:flex-col">
                            <TextField text={getMinValue(limits.payin)} label="min" />
                            <TextField text={getMaxValue(limits.payin)} label="max" />
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:gap-2">
                        <TextField text={translate("app.widgets.limits.payment")} />
                        <div className="flex flex-row gap-2 sm:flex-col">
                            <TextField text={getMinValue(limits.payout)} label="min" />
                            <TextField text={getMaxValue(limits.payout)} label="max" />
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 sm:gap-2">
                        <TextField text={translate("app.widgets.limits.reward")} />
                        <div className="flex flex-row gap-2 sm:flex-col">
                            <TextField text={getMinValue(limits.reward)} label="min" />
                            <TextField text={getMaxValue(limits.reward)} label="max" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-end gap-[10px] sm:flex-row">
                    <Button variant="outline" onClick={() => setEditClicked(true)} disabled={disabled}>
                        {translate("app.ui.actions.edit")}
                    </Button>
                    {/* <Button variant="outline_gray" onClick={handleDelete}>
                        {translate("app.widgets.limits.reset")}
                    </Button> */}
                </div>
            </div>
            {/* <DeleteLimitsDialog id={directionId} open={deleteClicked} onOpenChange={setDeleteClicked} /> */}
        </>
    );
};
