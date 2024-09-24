import { X, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, value: propValue, onChange, disabled, ...props }, ref) => {
        const [inputValue, setInputValue] = React.useState<string | number | readonly string[] | undefined>(
            propValue || ""
        );

        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);

        const inputRef = React.useRef<HTMLInputElement>(null);

        // Sync internal inputValue with external value prop if provided
        React.useEffect(() => {
            if (propValue !== undefined) {
                setInputValue(propValue);
            }
        }, [propValue]);

        React.useImperativeHandle(ref, () => inputRef.current!);

        const handleClear = () => {
            setInputValue("");
            if (onChange) {
                const event = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
            inputRef.current?.focus();
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
            if (onChange) {
                onChange(e);
            }
        };

        const showClearButton = inputValue && isFocused;

        return (
            <div className="relative flex items-center w-full">
                <input
                    type={type === "password" && showPassword ? "text" : type}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    className={cn(
                        "flex h-10 w-full rounded-4 text-neutral-80 border border-neutral-40 hover:border-green-50 active:border-green-50 focus:border-green-50 bg-neutral-0 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-60 focus:outline-none disabled:border-neutral-40 disabled:bg-neutral-40 transition duration-200",
                        className,
                        inputValue || type === "password" ? "pr-12" : "pr-10"
                    )}
                    ref={inputRef}
                    {...props}
                />
                {showClearButton && (
                    <button
                        type="button"
                        onMouseDown={handleClear}
                        tabIndex={-1}
                        className={cn(
                            "absolute inset-y-0",
                            type === "password" ? "right-9" : "right-3",
                            "flex items-center justify-center text-neutral-60 hover:text-neutral-80 transition-colors duration-200"
                        )}>
                        <X className="w-4 h-4" />
                    </button>
                )}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        tabIndex={-1}
                        className="absolute right-3 top-0 bottom-0 flex items-center justify-center">
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
                    </button>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
