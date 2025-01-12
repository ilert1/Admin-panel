import { X } from "lucide-react";

interface ClearButtonProps {
    handleClear: (e: React.MouseEvent) => void;
}
export const ClearButton = (props: ClearButtonProps) => {
    const { handleClear } = props;

    return (
        <span
            className="pr-[4px] flex items-center justify-center bg-black h-[36px] border-neutral-60 border border-x-0 cursor-pointer"
            onMouseDown={handleClear}>
            <X className="w-4 h-4" />
        </span>
    );
};
