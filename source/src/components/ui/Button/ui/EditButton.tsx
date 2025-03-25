import { Pen } from "lucide-react";
import { Button } from "../button";

export const EditButton = ({ onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <div className="flex justify-center">
            <Button onClick={onClick} variant="text_btn" className="h-8 w-8 bg-transparent p-0">
                <Pen className="h-6 w-6" />
            </Button>
        </div>
    );
};
