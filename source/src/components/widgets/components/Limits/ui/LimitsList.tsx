import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { LimitCard } from "./LimitCard";
import { EditLimitCard } from "./EditLimitCard";
import { Limits } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { ResourceType } from "../model/types/limits";

interface LimitsProps {
    id: string;
    limits: Limits;
    className?: string;
    resource: ResourceType;
}

export const LimitsList = (props: LimitsProps) => {
    const { id, limits, className, resource } = props;
    const translate = useTranslate();

    const [editClicked, setEditClicked] = useState(false);

    return (
        <div className={cn("mt-[10px] w-full px-2")}>
            <div className="p flex w-full flex-col rounded-[8px] bg-neutral-0 px-[32px] dark:bg-neutral-100">
                <h3 className="mb-[16px] mt-[16px] text-display-3 text-neutral-90 dark:text-neutral-0">
                    {translate("app.widgets.limits.limits")}
                </h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {editClicked ? (
                        <EditLimitCard
                            id={id}
                            setEditClicked={setEditClicked}
                            limitsData={limits}
                            resource={resource}
                        />
                    ) : (
                        <LimitCard limits={limits} setEditClicked={setEditClicked} directionId={id} />
                    )}
                </div>
            </div>
        </div>
    );
};
