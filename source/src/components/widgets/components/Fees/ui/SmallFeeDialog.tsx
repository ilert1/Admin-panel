import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslate } from "react-admin";

interface SmallFeeDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    onSubmit: () => void;
}

export const SmallFeeDialog = ({ open, onOpenChange = () => {}, onSubmit }: SmallFeeDialogProps) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[310px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.direction.fees.smallFeeDialog.title")}
                        <span className="text-display-4 text-red-40">
                            {translate("resources.direction.fees.smallFeeDialog.lessThenOne")}
                        </span>
                    </DialogTitle>
                    <DialogTitle>{translate("resources.direction.fees.smallFeeDialog.save")}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <DialogFooter>
                    <div className="flex w-full gap-6">
                        <Button onClick={() => onSubmit()} variant="default" className="w-full">
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            type="button"
                            variant="outline_gray"
                            className="w-full"
                            onClick={() => {
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
