import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { ReactNode } from "react";

export const ErrorBadge = ({ errorMessage }: { errorMessage?: string | ReactNode }) => {
    return (
        <span
            className={cn(
                "flex items-center justify-center bg-black h-[36px] pr-[4px]",
                "bg-neutral-0",
                "dark:bg-neutral-100"
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
