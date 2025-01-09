import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRefresh, useTranslate } from "react-admin";

interface ConfirmCreatingDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    setConfirmed?: (state: boolean) => void;
}
export const ConfirmCreatingDialog = (props: ConfirmCreatingDialogProps) => {
    const translate = useTranslate();
    const { open, onOpenChange = () => {}, setConfirmed = () => {} } = props;
    const refresh = useRefresh();

    const handleConfirmClicked = () => {
        onOpenChange(false);
        setConfirmed(true);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[270px] max-h-[240px] overflow-y-auto sm:max-h-[200px] bg-muted overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.provider.recreateConfirm")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-around w-full">
                        <Button onClick={handleConfirmClicked}>{translate("app.ui.actions.confirm")}</Button>
                        <Button
                            variant={"deleteGray"}
                            onClick={() => {
                                onOpenChange(false);
                                refresh();
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
