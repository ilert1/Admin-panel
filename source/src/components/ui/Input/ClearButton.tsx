import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { InputTypes } from "./input";

interface ClearButtonProps {
    handleClear: (e: React.MouseEvent) => void;
    inputVariant: InputTypes;
}
export const ClearButton = (props: ClearButtonProps) => {
    const { handleClear, inputVariant } = props;

    return (
        <span
            className={cn(
                "pr-[4px] flex items-center justify-center bg-black h-[36px] cursor-pointer",
                "bg-neutral-0 text-neutral-60",
                "dark:text-neutral-40",
                inputVariant === InputTypes.GRAY ? "dark:bg-muted" : "dark:bg-neutral-100"
            )}
            onMouseDown={handleClear}>
            <X className="w-4 h-4" />
        </span>
    );
};
