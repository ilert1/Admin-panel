import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="z-[60] bg-muted max-w-full w-[716px] h-full max-h-[100dvh] md:h-auto max-h-[100dvh] !overflow-y-auto rounded-[0] md:rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mb-4 text-center">
                        {translate("resources.provider.creatingProvider")}
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <ProviderCreate
                        onClose={() => {
                            refresh();
                            onOpenChange(false);
                        }}
                    />
                </AlertDialogHeader>
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
