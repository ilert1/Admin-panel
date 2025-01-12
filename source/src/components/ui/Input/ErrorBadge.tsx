import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

export const ErrorBadge = () => {
    return (
        <span
            className={cn(
                "flex items-center justify-center bg-black h-[36px] pr-[4px]",
                "bg-neutral-0",
                "dark:bg-neutral-100"
            )}>
            <TriangleAlert className="text-red-40" width={14} height={14} />
        </span>
    );
};
