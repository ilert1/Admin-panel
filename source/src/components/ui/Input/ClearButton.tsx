import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ClearButtonProps {
    handleClear: (e: React.MouseEvent) => void;
}
export const ClearButton = (props: ClearButtonProps) => {
    const { handleClear } = props;

    return (
        <span
            className={cn(
                "pr-[4px] flex items-center justify-center bg-black h-[36px] cursor-pointer",
                "bg-neutral-0 text-neutral-60",
                "dark:bg-neutral-100 dark:text-neutral-40"
            )}
            onMouseDown={handleClear}>
            <X className="w-4 h-4" />
        </span>
    );
};
