import { cn } from "@/lib/utils";
import { TestTubeDiagonal } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslate } from "react-admin";
import { useMediaQuery } from "react-responsive";

const PopupState: string = import.meta.env.VITE_TEST_POPUP;

export const TestEnvText = () => {
    const [showTestEnvText, setShowTextEnvText] = useState(false);
    const translate = useTranslate();
    const isMobile = useMediaQuery({ query: "(max-width: 300px)" });

    useEffect(() => {
        const shouldShow = PopupState === "true";

        if (shouldShow) {
            setShowTextEnvText(true);
        }
    }, []);

    return (
        <div className={cn("mb-[24px] flex items-center gap-3 bg-red-50 px-4 py-2", !showTestEnvText && "hidden")}>
            <TestTubeDiagonal className={cn("h-6 w-6", isMobile && "hidden")} />
            <span>
                {translate("app.ui.testPopup.youReInTestEnv")} {translate("app.ui.testPopup.allActionsSimulated")}
            </span>
        </div>
    );
};
