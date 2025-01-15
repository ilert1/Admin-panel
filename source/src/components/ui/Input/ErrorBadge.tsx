import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { ReactNode } from "react";
import { InputTypes } from "./input";
import { SelectType } from "../select";

interface ErrorBadgeProps {
    errorMessage?: string | ReactNode;
    variant: InputTypes | SelectType;
    className?: string;
}
export const ErrorBadge = (props: ErrorBadgeProps) => {
    const { errorMessage, variant, className = "" } = props;

    return (
        <span
            className={cn(
                "flex items-center justify-center bg-black h-[36px] pr-[4px]",
                "bg-neutral-0",
                "dark:bg-neutral-100",
                variant === InputTypes.GRAY || SelectType.GRAY ? "dark:bg-muted" : "dark:bg-neutral-100",
                className
            )}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <TriangleAlert className="text-red-40" width={14} height={14} />
                    </TooltipTrigger>
                    <TooltipContent>{errorMessage}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </span>
    );
};
