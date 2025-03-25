import { Button } from "@/components/ui/Button";
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
import { Textarea } from "@/components/ui/textarea";
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
            <DialogContent disableOutsideClick className="h-[468px] max-h-full max-w-[716px] rounded-[16px] bg-muted">
                <DialogHeader>
                    <DialogTitle />
                    <DialogDescription />
                    <div className="flex max-h-[468px] w-full flex-col gap-[24px]">
                        <div className="flex items-center justify-center text-center">
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
                                <div className="flex flex-col">
                                    <Label
                                        className="text-note-1 !text-neutral-60 dark:!text-neutral-30"
                                        htmlFor="private">
                                        {translate("resources.provider.privateKey")}
                                    </Label>
                                    <div className="flex items-center justify-center gap-2">
                                        <Textarea
                                            value={privateKey}
                                            className="h-24 w-full resize-none overflow-auto rounded p-2 !text-neutral-50 dark:bg-muted dark:!text-neutral-70"
                                            readOnly
                                            id="private"
                                        />
                                        <Button
                                            onClick={handlePrivateCopy}
                                            variant={copyPrivateClicked ? "default" : "text_btn"}
                                            className="ml-0 px-[10px] py-[16px] text-center">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <Label
                                        className="text-note-1 !text-neutral-60 dark:!text-neutral-30"
                                        htmlFor="public">
                                        {translate("resources.provider.fields.pk")}
                                    </Label>
                                    <div className="flex items-center justify-center gap-2">
                                        <Textarea
                                            value={publicKey}
                                            className="h-24 w-full resize-none overflow-auto rounded p-2 !text-neutral-50 dark:bg-muted dark:!text-neutral-70"
                                            readOnly
                                            id="public"
                                        />
                                        <Button
                                            onClick={handlePublicCopy}
                                            variant={copyPublicClicked ? "default" : "text_btn"}
                                            className="ml-0 px-[10px] py-[16px] text-center">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogHeader>
                {!isLoading && (
                    <DialogFooter className="flex !justify-between">
                        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:gap-0">
                            <div className="flex flex-col">
                                <span className="text-title-1 text-red-40">
                                    {translate("resources.provider.warning")}
                                </span>
                                <span className="text-title-1 text-red-40">
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
