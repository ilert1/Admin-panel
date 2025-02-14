import { Button } from "@/components/ui/Button";
import { Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslate } from "react-admin";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

interface PayOutTgBannerProps {
    url: string;
    onClose: () => void;
}

export const PayOutTgBanner = ({ url, onClose }: PayOutTgBannerProps) => {
    const translate = useTranslate();

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const copy = useCallback(() => {
        navigator.clipboard.writeText(url);
        toast.success(translate("app.ui.textField.copied"), {
            dismissible: true,
            duration: 1000
        });
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div className="relative p-[30px] flex flex-col rounded-16 bg-neutral-0 dark:bg-neutral-100 max-w-[700px] w-full md:mx-4">
                <h1 className="mb-2 text-xl text-center text-neutral-80 dark:text-neutral-30">
                    {translate("app.widgets.forms.payoutBanner.title")}
                </h1>
                <p className="m-0 text-base text-center text-neutral-80 dark:text-neutral-30">
                    {translate("app.widgets.forms.payoutBanner.subtitle")}
                </p>
                <p className="mb-6 text-base text-center text-neutral-80 dark:text-neutral-30">
                    {translate("app.widgets.forms.payoutBanner.description")}
                </p>

                <Button
                    variant={"text_btn"}
                    className="mb-6 cursor-pointer bg-muted p-4 flex flex-row justify-start gap-2 rounded-8 text-green-50 h-auto"
                    onClick={copy}>
                    <Copy className="h-4 w-4 cursor-pointer" />
                    <span className="text-base truncate">{url}</span>
                </Button>

                <Button
                    onClick={() => setShowCancelDialog(true)}
                    variant={"outline"}
                    className="self-start flex flex-1 justify-between items-center gap-3 px-4 py-2 hover:bg-neutral-0 hover:border-green-40 hover:text-green-40 dark:hover:bg-neutral-100 dark:hover:border-green-40">
                    {translate("app.ui.actions.close")}
                </Button>

                <img
                    src="/BlowFishPayOut.svg"
                    alt="Decorative"
                    className="absolute rounded-8 bottom-0 right-0 pointer-events-none"
                />
            </div>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="max-w-[340px] px-[24px] bg-muted">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            {translate("app.widgets.forms.payoutBanner.closeTitle")}
                        </DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex justify-between gap-[35px] w-full">
                            <Button onClick={() => onClose()}>{translate("app.ui.actions.close")}</Button>
                            <Button
                                variant="outline_gray"
                                onClick={() => setShowCancelDialog(false)}
                                className="!ml-0 px-3">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
