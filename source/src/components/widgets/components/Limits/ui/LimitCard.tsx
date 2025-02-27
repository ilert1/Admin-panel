import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/text-field";
import { useTranslate } from "react-admin";

export const LimitCard = () => {
    const translate = useTranslate();

    return (
        <div className="flex flex-col gap-4 bg-muted p-4 rounded-8 mb-4">
            <div className="flex">
                <div className="flex flex-col gap-2 flex-1">
                    <TextField text={translate("app.widgets.limits.deposit")} />
                    <div className="flex gap-6">
                        <TextField text="100" label="min (int)" />
                        <TextField text="100 000" label="max (int)" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <TextField text={translate("app.widgets.limits.payment")} />
                    <div className="flex gap-6">
                        <TextField text="100" label="min (int)" />
                        <TextField text="100 000" label="max (int)" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <TextField text={translate("app.widgets.limits.reward")} />
                    <div className="flex gap-6">
                        <TextField text="100" label="min (int)" />
                        <TextField text="100 000" label="max (int)" />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-[10px]">
                <Button variant="outline">{translate("app.ui.actions.edit")}</Button>
                <Button variant="outline_gray">{translate("app.ui.actions.delete")}</Button>
            </div>
        </div>
    );
};
