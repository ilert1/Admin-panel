import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { ProvidersSecPolicyEdit } from "../../edit/Providers/ProviderSecPolicyEdit";

interface EditProviderSecPolicyProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    id?: string;
}

export const EditProviderSecPolicy = (props: EditProviderSecPolicyProps) => {
    const translate = useTranslate();

    const { open, id, onOpenChange = () => {} } = props;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">{translate("resources.provider.editingProvider")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ProvidersSecPolicyEdit id={id} onClose={() => onOpenChange(false)} />
                {/* <ProvidersEdit id={id} onClose={() => onOpenChange(false)} /> */}
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
