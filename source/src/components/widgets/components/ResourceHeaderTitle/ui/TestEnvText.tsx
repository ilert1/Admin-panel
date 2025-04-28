import { cn } from "@/lib/utils";
import { TestTubeDiagonal } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslate } from "react-admin";

const PopupState = import.meta.env.VITE_TEST_POPUP;

export const TestEnvText = () => {
    const [showTestEnvText, setShowTextEnvText] = useState(false);
    const translate = useTranslate();

    useEffect(() => {
        const shouldShow = PopupState === "true" || PopupState === true;

        if (shouldShow) {
            setShowTextEnvText(true);
        }
    }, []);

    return (
        <div
            className={cn(
                "mb-[24px] flex h-10 w-full items-center gap-3 bg-red-50 px-4",
                !showTestEnvText && "hidden"
            )}>
            <TestTubeDiagonal className="h-6 w-6" />
            <span>
                {translate("app.ui.testPopup.youReInTestEnv")} {translate("app.ui.testPopup.allActionsSimulated")}
            </span>
        </div>
    );
};
