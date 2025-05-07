import { Trash2 } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

export const TrashButton = ({ onClick, disabled, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <div className="flex justify-center">
            <Button
                disabled={disabled}
                onClick={onClick}
                variant="text_btn"
                className="h-8 w-8 bg-transparent p-0 [&:disabled>svg]:text-neutral-70">
                <Trash2 className={cn("h-6 w-6 text-red-40 hover:text-red-30 active:text-red-50", className)} />
            </Button>
        </div>
    );
};
