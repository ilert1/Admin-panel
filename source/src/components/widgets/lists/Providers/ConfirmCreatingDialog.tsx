import { Button } from "@/components/ui/Button";
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
            <DialogContent className="max-h-[240px] max-w-[320px] overflow-auto overflow-y-auto bg-muted sm:max-h-[200px]">
                <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle className="text-center text-display-4">
                        {translate("resources.provider.recreateConfirm")}
                    </DialogTitle>
                    <DialogDescription className="!text-center !text-title-1 text-green-60 dark:text-neutral-0">
                        {translate("resources.provider.recreateConfirmDescription")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full flex-col justify-around gap-4 sm:flex-row sm:gap-0">
                        <Button onClick={handleConfirmClicked}>{translate("resources.provider.recreate")}</Button>
                        <Button
                            variant={"outline"}
                            className="bg-neutral-0 dark:bg-neutral-100"
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
