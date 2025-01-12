import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface EyeButtonProps {
    showPassword: boolean;
    setShowPassword: (state: boolean) => void;
    disabled: boolean;
    inputValue: string | number | readonly string[] | undefined;
}

export const EyeButton = (props: EyeButtonProps) => {
    const { showPassword, disabled, inputValue, setShowPassword } = props;

    return (
        <span
            className="flex items-center justify-center cursor-pointer bg-black h-[36px] border border-neutral-60 border-l-0 rounded-r-md pr-[4px] transition-colors duration-200\"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
                <EyeOff
                    className={cn(
                        "h-5 w-5",
                        disabled ? "text-neutral-60" : inputValue ? "text-green-50" : "text-green-40"
                    )}
                />
            ) : (
                <Eye
                    className={cn(
                        "h-5 w-5",
                        disabled ? "text-neutral-60" : inputValue ? "text-green-50" : "text-green-40"
                    )}
                />
            )}
        </span>
    );
};
