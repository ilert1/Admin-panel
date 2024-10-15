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
import { LoadingAlertDialog } from "@/components/ui/loading";
import { useCreateTestKeys } from "@/hooks/useCreateTestKeys";
import { Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslate } from "react-admin";

export interface TestKeysModalProps {
    open?: boolean;
    onOpenChange?: (state: boolean) => void;
}

export const TestKeysModal = (props: TestKeysModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { open = false, onOpenChange = () => {} } = props;
    const translate = useTranslate();

    const [copyPrivateClicked, setCopyPrivateClicked] = useState(false);
    const [copyPublicClicked, setCopyPublicClicked] = useState(false);

    const { isLoading = false, privateKey, publicKey, setIsLoading } = useCreateTestKeys(open);

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
            <DialogContent className="bg-muted max-w-[716px] rounded-[16px]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription> </DialogDescription>
                    <div className="flex flex-col gap-[24px] max-h-[468px] w-full">
                        <div className="text-center">
                            <h4 className="text-display-4 text-neutral-100">
                                {translate("resources.providers.keysCreating")}
                            </h4>
                        </div>
                        {isLoading ? (
                            <LoadingAlertDialog />
                        ) : (
                            <>
                                <div className="flex flex-col gap-[4px]">
                                    <Label className="text-note-1 text-neutral-30" htmlFor="private">
                                        {translate("resources.providers.privateKey")}
                                    </Label>
                                    <div className="flex items-center justify-center">
                                        <textarea
                                            value={privateKey}
                                            className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto bg-muted text-neutral-70"
                                            readOnly
                                            id="private"
                                        />
                                        <Button
                                            onClick={handlePrivateCopy}
                                            variant={"clearBtn"}
                                            className={
                                                copyPrivateClicked
                                                    ? "ml-0 text-center py-[16px] px-[10px] !bg-green-50"
                                                    : "ml-0 text-center py-[16px] px-[10px]"
                                            }>
                                            <Copy
                                                className={`w-4 h-4 ${
                                                    copyPrivateClicked ? "text-neutral-100" : "text-green-50"
                                                }`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[4px]">
                                    <Label className="text-note-1 text-neutral-30" htmlFor="public">
                                        {translate("resources.providers.fields.pk")}
                                    </Label>
                                    <div className="flex items-center justify-center">
                                        <textarea
                                            value={publicKey}
                                            className="w-full h-24 p-2 border border-neutral-400 rounded resize-none overflow-auto bg-muted text-neutral-70"
                                            readOnly
                                            id="public"
                                        />
                                        <Button
                                            onClick={handlePublicCopy}
                                            variant={copyPublicClicked ? "default" : "clearBtn"}
                                            className={
                                                copyPublicClicked
                                                    ? "ml-0 text-center py-[16px] px-[10px] !bg-green-50"
                                                    : "ml-0 text-center py-[16px] px-[10px]"
                                            }>
                                            <Copy
                                                className={`w-4 h-4 ${
                                                    copyPublicClicked ? "text-neutral-100" : "text-green-50"
                                                }`}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogHeader>
                {!isLoading && (
                    <DialogFooter className="flex !justify-between">
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-red-20 text-title-1">
                                    {translate("resources.provider.warning")}
                                </span>
                                <span className="text-red-20 text-title-1">
                                    {translate("resources.provider.sendToDevOps")}
                                </span>
                            </div>
                            <Button
                                onClick={() => {
                                    setCopyPrivateClicked(false);
                                    setCopyPublicClicked(false);
                                    onOpenChange(false);
                                }}>
                                {translate("resources.providers.close")}
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
