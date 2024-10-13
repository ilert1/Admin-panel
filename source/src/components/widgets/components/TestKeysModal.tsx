import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import { useCreateTestKeys } from "@/hooks/useCreateTestKeys";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslate } from "react-admin";

export interface TestKeysModalProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const TestKeysModal = (props: TestKeysModalProps) => {
    const { open = false, onOpenChange } = props;
    const translate = useTranslate();

    const [copyPrivateClicked, setCopyPrivateClicked] = useState(false);
    const [copyPublicClicked, setCopyPublicClicked] = useState(false);

    // Используем хук с запросом
    const { isLoading = false, privateKey, publicKey, setIsLoading } = useCreateTestKeys(open);

    useEffect(() => {
        setIsLoading(true);
        if (!open) {
            setCopyPrivateClicked(false);
            setCopyPublicClicked(false);
        }
    }, [open]);

    const handlePrivateCopy = () => {
        setCopyPrivateClicked(true);
        navigator.clipboard.writeText(privateKey).then(() => {
            console.log("Text copied to clipboard");
        });
    };

    const handlePublicCopy = () => {
        setCopyPublicClicked(true);
        navigator.clipboard.writeText(publicKey).then(() => {
            console.log("Text copied to clipboard");
        });
    };
    console.log(isLoading);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <AlertDialogContent className="bg-muted max-w-[716px] rounded-[16px]">
                <AlertDialogHeader>
                    <AlertDialogTitle></AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-col gap-[24px] max-h-[468px]">
                            <div className="text-center">
                                <h4 className="text-display-4 text-neutral-100">
                                    {translate("resources.provider.keysCreating")}
                                </h4>
                            </div>
                            {isLoading ? (
                                <LoadingAlertDialog />
                            ) : (
                                <>
                                    <div className="flex flex-col gap-[4px]">
                                        <Label className="text-note-1" htmlFor="private">
                                            {translate("resources.provider.privateKey")}
                                        </Label>
                                        <div className="flex items-center justify-center gap-[14px]">
                                            <textarea
                                                value={privateKey}
                                                className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto bg-muted"
                                                readOnly
                                                id="private"
                                            />
                                            <Button
                                                onClick={handlePrivateCopy}
                                                variant={"clearBtn"}
                                                className="ml-0 py-[16px] px-[10px] text-center">
                                                <Copy className="w-4 h-4 text-green-50" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[4px]">
                                        <Label className="text-note-1" htmlFor="public">
                                            {translate("resources.provider.fields.pk")}
                                        </Label>
                                        <div className="flex items-center justify-center gap-[14px]">
                                            <textarea
                                                value={publicKey}
                                                className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto bg-muted"
                                                readOnly
                                                id="public"
                                            />
                                            <Button
                                                onClick={handlePublicCopy}
                                                variant={"clearBtn"}
                                                className="ml-0 text-center py-[16px] px-[10px]">
                                                <Copy className="w-4 h-4 text-green-50" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {!isLoading && (
                    <AlertDialogFooter className="flex !justify-between">
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-red-20 text-title-1">
                                    {translate("resources.provider.warning")}
                                </span>
                                <span className="text-red-20 text-title-1">
                                    {translate("resources.provider.sendToDevOps")}
                                </span>
                            </div>
                            <AlertDialogAction
                                onClick={() => {
                                    setCopyPrivateClicked(false);
                                    setCopyPublicClicked(false);
                                }}>
                                {translate("resources.provider.close")}
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};
