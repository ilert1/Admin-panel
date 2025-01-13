import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useCreateTestKeys } from "@/hooks/useCreateTestKeys";
import { Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslate } from "react-admin";

export interface KeysModalProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
    isTest?: boolean;
    name?: string;
    refresh?: () => void;
}

export const KeysModal = (props: KeysModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { open = false, onOpenChange = () => {}, refresh = () => {}, isTest = true, name = "" } = props;
    const translate = useTranslate();

    const [copyPrivateClicked, setCopyPrivateClicked] = useState(false);
    const [copyPublicClicked, setCopyPublicClicked] = useState(false);

    const { isLoading = false, privateKey, publicKey, setIsLoading } = useCreateTestKeys(open, isTest, name);

    useEffect(() => {
        setIsLoading(true);
        if (!open) {
            setCopyPrivateClicked(false);
            setCopyPublicClicked(false);
        }
    }, [open, setIsLoading]);

    const handlePrivateCopy = useCallback(() => {
        setCopyPrivateClicked(true);
        navigator.clipboard.writeText(privateKey);
    }, [privateKey]);

    const handlePublicCopy = useCallback(() => {
        setCopyPublicClicked(true);
        navigator.clipboard.writeText(publicKey);
    }, [publicKey]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent disableOutsideClick className="bg-muted max-w-[716px] max-h-full h-[468px] rounded-[16px]">
                <DialogHeader>
                    <DialogTitle />
                    <DialogDescription />
                    <div className="flex flex-col gap-[24px] max-h-[468px] w-full">
                        <div className="text-center flex items-center justify-center">
                            <TextField
                                text={
                                    isTest
                                        ? translate("resources.provider.keysCreating")
                                        : translate("resources.provider.realKeysCreating")
                                }
                                className="!text-display-4"
                            />
                        </div>
                        {isLoading ? (
                            <LoadingBlock />
                        ) : (
                            <>
                                <div className="flex flex-col gap-[4px]">
                                    <Label className="text-note-1 text-neutral-30" htmlFor="private">
                                        {translate("resources.provider.privateKey")}
                                    </Label>
                                    <div className="flex items-center justify-center gap-2">
                                        <textarea
                                            value={privateKey}
                                            className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto dark:bg-muted text-neutral-50 dark:text-neutral-70"
                                            readOnly
                                            id="private"
                                        />
                                        <Button
                                            onClick={handlePrivateCopy}
                                            variant={copyPrivateClicked ? "default" : "text_btn"}
                                            className="ml-0 text-center py-[16px] px-[10px]">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[4px]">
                                    <Label className="text-note-1 text-neutral-30" htmlFor="public">
                                        {translate("resources.provider.fields.pk")}
                                    </Label>
                                    <div className="flex items-center justify-center gap-2">
                                        <textarea
                                            value={publicKey}
                                            className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto dark:bg-muted text-neutral-50 dark:text-neutral-70"
                                            readOnly
                                            id="public"
                                        />
                                        <Button
                                            onClick={handlePublicCopy}
                                            variant={copyPublicClicked ? "default" : "text_btn"}
                                            className="ml-0 text-center py-[16px] px-[10px]">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogHeader>
                {!isLoading && (
                    <DialogFooter className="flex !justify-between">
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-red-40 dark:text-red-20 text-title-1">
                                    {translate("resources.provider.warning")}
                                </span>
                                <span className="text-red-40 dark:text-red-20 text-title-1">
                                    {translate("resources.provider.sendToDevOps")}
                                </span>
                            </div>
                            <Button
                                onClick={() => {
                                    setCopyPrivateClicked(false);
                                    setCopyPublicClicked(false);
                                    onOpenChange(false);
                                    refresh();
                                }}>
                                {translate("resources.provider.close")}
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
