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
                "flex h-[36px] cursor-pointer items-center justify-center bg-neutral-0 pr-[4px]",
                "text-neutral-60",
                "dark:text-neutral-40",
                inputVariant === InputTypes.GRAY ? "dark:bg-muted" : "bg-neutral-0 dark:bg-neutral-100"
            )}
            onMouseDown={handleClear}>
            <X className="h-4 w-4" />
        </span>
    );
};
