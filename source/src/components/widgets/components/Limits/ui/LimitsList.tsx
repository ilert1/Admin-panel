import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { LimitCard } from "./LimitCard";
import { EditLimitCard } from "./EditLimitCard";
import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface LimitsProps {
    id: string;
    limits: Limits;
    className?: string;
}

export const LimitsList = (props: LimitsProps) => {
    const { id, limits, className } = props;
    const translate = useTranslate();

    const [editClicked, setEditClicked] = useState(false);

    return (
        <div className={cn("mt-[10px] w-full")}>
            <div className="flex flex-col bg-neutral-0 dark:bg-neutral-100 px-[32px] rounded-[8px] w-full ">
                <h3 className="text-display-3 mt-[16px] mb-[16px]">{translate("app.widgets.limits.limits")}</h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {editClicked ? (
                        <EditLimitCard directionId={id} setEditClicked={setEditClicked} limitsData={limits} />
                    ) : (
                        <LimitCard limits={limits} setEditClicked={setEditClicked} directionId={id} />
                    )}
                </div>
            </div>
        </div>
    );
};
