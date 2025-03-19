import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useRefresh, useTranslate } from "react-admin";
import { ProviderCreate } from "../../create";

interface CreateProviderDialogProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}
export const CreateProviderDialog = (props: CreateProviderDialogProps) => {
    const { open, onOpenChange = () => {} } = props;
    const refresh = useRefresh();
    const translate = useTranslate();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="bg-muted max-w-full sm:w-[716px]  sm:max-h-[100dvh] !overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.provider.creatingProvider")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <ProviderCreate
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
