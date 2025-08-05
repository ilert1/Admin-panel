import { Button } from "@/components/ui/Button";
import {
    DialogHeader,
    DialogFooter,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import TestEnvIcon from "@/lib/icons/TestEnvIcon.svg?react";
import { useState, useEffect } from "react";
import { useTranslate } from "react-admin";

const POPUP_STATE = import.meta.env.VITE_TEST_POPUP === "true" ? true : false;

export const TestEnvPopup = () => {
    const [open, onOpenChange] = useState(false);
    const translate = useTranslate();

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem("testEnvShown") === "true";

        if (POPUP_STATE && !alreadyShown) {
            onOpenChange(true);
            sessionStorage.setItem("testEnvShown", "true");
        }
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-full !overflow-y-auto bg-muted !px-[24.5px] sm:max-h-[100dvh] sm:w-[440px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center" />
                    <DialogDescription />
                    <div className="flex flex-col gap-4">
                        <TestEnvIcon className="w-full min-w-[120px] max-w-[390px]" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-display-1">{translate("app.ui.testPopup.attention")}</h1>
                            <span>{translate("app.ui.testPopup.youReInTestEnv")}</span>
                            <span>{translate("app.ui.testPopup.allActionsSimulated")}</span>
                        </div>
                        <Button className="w-full max-w-[260px] self-center" onClick={() => onOpenChange(false)}>
                            {translate("app.ui.testPopup.ok")}
                        </Button>
                    </div>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
