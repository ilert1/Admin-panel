import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalsDataProvider } from "@/data";
import { useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

export interface GenerateCallbackDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    terminalId: string;
}
export const GenerateCallbackDialog = (props: GenerateCallbackDialogProps) => {
    const { open, terminalId, onOpenChange } = props;
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const refresh = useRefresh();
    const translate = useTranslate();
    const dataProvider = new TerminalsDataProvider();

    const appToast = useAppToast();

    const onSubmit = async () => {
        if (buttonDisabled) {
            return;
        }

        setButtonDisabled(true);
        try {
            await dataProvider.createCallback(terminalId);
            appToast("success", translate("resources.terminals.callbackCreatedSuccessfully"));
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setButtonDisabled(false);
            refresh();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[380px] max-w-[340px] overflow-auto bg-muted sm:max-h-[350px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.terminals.callbackCreating")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden" />
                <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                    <Button className="w-full" disabled={buttonDisabled} type="submit" onClick={onSubmit}>
                        {translate("app.ui.actions.confirm")}
                    </Button>
                    <Button
                        type="reset"
                        className="w-full"
                        variant={"outline"}
                        onClick={() => {
                            onOpenChange(false);
                        }}>
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
