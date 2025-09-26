import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { ReactNode } from "react";
import { TooltipPortal } from "@radix-ui/react-tooltip";
interface ErrorBadgeProps {
    errorMessage?: string | ReactNode;
    disableErrorMessage?: boolean;
    className?: string;
}
export const ErrorBadge = (props: ErrorBadgeProps) => {
    const { errorMessage, disableErrorMessage = false, className = "" } = props;

    return (
        <span className={cn("flex h-[36px] items-center justify-center bg-black bg-transparent pr-[4px]", className)}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger tabIndex={-1} asChild>
                        <TriangleAlert className="text-red-40" width={14} height={14} />
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent
                            tabIndex={-1}
                            side="left"
                            sideOffset={5}
                            align="center"
                            className={cn(
                                "z-[100] text-wrap border-red-40 text-center !text-note-1 text-neutral-90 dark:text-neutral-0",
                                disableErrorMessage && "hidden"
                            )}>
                            {errorMessage}
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </TooltipProvider>
        </span>
    );
};
