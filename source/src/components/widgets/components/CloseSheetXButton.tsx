import { XIcon } from "lucide-react";

export const CloseSheetXButton = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    return (
        <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
            <XIcon className="h-[28px] w-[28px]" />
        </button>
    );
};
