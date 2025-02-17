import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { ReactNode } from "react";
interface ErrorBadgeProps {
    errorMessage?: string | ReactNode;
    className?: string;
}
export const ErrorBadge = (props: ErrorBadgeProps) => {
    const { errorMessage, className = "" } = props;

    return (
        <span className={cn("flex items-center justify-center bg-black h-[36px] pr-[4px] bg-transparent", className)}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger tabIndex={-1} asChild>
                        <TriangleAlert className="text-red-40" width={14} height={14} />
                    </TooltipTrigger>
                    <TooltipContent
                        tabIndex={-1}
                        side="left"
                        sideOffset={5}
                        align="center"
                        className="z-50 border-red-40 text-red-40 dark:text-neutral-0">
                        {errorMessage}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </span>
    );
};
