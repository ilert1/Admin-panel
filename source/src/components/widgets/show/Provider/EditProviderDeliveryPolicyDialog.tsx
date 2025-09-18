import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useTranslate } from "react-admin";
import { ProvidersDeliveryPolicyEdit } from "../../edit/ProvidersDeliveryPolicyEdit";

interface IEditProviderDeliveryPolicyDialog {
    open: boolean;
    onOpenChange?: (state: boolean) => void;
    id: string;
}

export const EditProviderDeliveryPolicyDialog = ({
    open,
    id,
    onOpenChange = () => {}
}: IEditProviderDeliveryPolicyDialog) => {
    const translate = useTranslate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.callbridge.mapping.fields.delivery_policy.editingDialog")}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <ProvidersDeliveryPolicyEdit id={id} onOpenChange={onOpenChange} />
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
};
