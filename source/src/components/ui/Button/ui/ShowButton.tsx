import { EyeIcon } from "lucide-react";
import { Button } from "../button";

export const ShowButton = ({ onClick, disabled }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <div className="flex items-center justify-center">
            <Button
                onClick={onClick}
                variant="text_btn"
                className="h-7 w-7 p-0 bg-transparent flex items-center disabled:text-neutral-90 text-green-50 size-7 hover:text-green-40"
                disabled={disabled}>
                <EyeIcon className=" " />
            </Button>
        </div>
    );
};
