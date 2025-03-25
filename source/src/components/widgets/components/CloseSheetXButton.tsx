import { XIcon } from "lucide-react";

export const CloseSheetXButton = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    return (
        <button
            onClick={() => onOpenChange(false)}
            className="border-0 text-gray-500 outline-0 transition-colors hover:text-gray-700">
            <XIcon className="h-[28px] w-[28px]" />
        </button>
    );
};
