import { EyeIcon } from "lucide-react";
import { Button } from "../button";

export const ShowButton = ({ onClick, disabled }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <div className="flex items-center justify-center">
            <Button
                onClick={onClick}
                variant="text_btn"
                className="flex size-7 h-7 w-7 items-center bg-transparent p-0 text-green-50 hover:text-green-40 disabled:text-neutral-90"
                disabled={disabled}>
                <EyeIcon className=" " />
            </Button>
        </div>
    );
};
