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

    const withInputStyles = "text-green-50 hover:text-green-40 dark:hover:text-green-40";
    const withoutInputStyles = "text-green-50 dark:text-green-40 hover:text-green-40 dark:hover:text-green-40";

    return (
        <span
            className={cn(
                "flex items-center justify-center cursor-pointer h-[36px] rounded-r-md pr-[4px] transition-colors duration-200",
                "bg-neutral-0",
                "dark:bg-neutral-100"
            )}
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
                <EyeOff
                    className={cn(
                        "h-5 w-5 ",
                        disabled
                            ? "text-neutral-80 dark:text-neutral-60"
                            : inputValue
                            ? withInputStyles
                            : withoutInputStyles
                    )}
                />
            ) : (
                <Eye
                    className={cn(
                        "h-5 w-5",
                        disabled
                            ? "text-neutral-80 dark:text-neutral-60"
                            : inputValue
                            ? withInputStyles
                            : withoutInputStyles
                    )}
                />
            )}
        </span>
    );
};
