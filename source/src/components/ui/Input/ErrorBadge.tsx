import { TriangleAlert } from "lucide-react";

export const ErrorBadge = () => {
    return (
        <span className="flex items-center justify-center bg-black h-[36px] border border-neutral-60 border-x-0 pr-[4px]">
            <TriangleAlert className="text-red-40" width={14} height={14} />
        </span>
    );
};
