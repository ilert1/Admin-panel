import { Trash2 } from "lucide-react";
import { Button } from "../button";

export const TrashButton = ({ onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <div className="flex justify-center">
            <Button onClick={onClick} variant="text_btn" className="h-8 w-8 p-0 bg-transparent">
                <Trash2 className="h-6 w-6" />
            </Button>
        </div>
    );
};
