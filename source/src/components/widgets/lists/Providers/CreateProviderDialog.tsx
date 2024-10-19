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
            <DialogContent className="max-w-[716px] bg-muted">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.providers.editingProvider")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <ProviderCreate
                        onClose={() => {
                            onOpenChange(false);
                            refresh();
                        }}
                    />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
