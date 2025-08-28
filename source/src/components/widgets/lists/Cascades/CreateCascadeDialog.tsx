import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRefresh, useTranslate } from "react-admin";
import { CascadeCreate } from "../../create/CascadeCreate";

interface CreateCascadeDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateCascadeDialog = ({ open, onOpenChange = () => {} }: CreateCascadeDialogProps) => {
    const refresh = useRefresh();
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.cascadeSettings.cascades.creatingCascade")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <CascadeCreate
                        onClose={() => {
                            refresh();
                            onOpenChange(false);
                        }}
                    />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
