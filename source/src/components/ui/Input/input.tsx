import * as React from "react";
import { cn } from "@/lib/utils";
import { ClearButton } from "./clearButton";
import { ErrorBadge } from "./ErrorBadge";
import { EyeButton } from "./EyeButton";

export type BasicInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export enum InputTypes {
    DEFAULT = "default",
    GRAY = "gray"
}

interface InputProps extends BasicInputProps {
    variant?: InputTypes;
    error?: boolean | string;
    label?: string;
    shadow?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            value: propValue,
            onChange,
            disabled,
            children,
            variant,
            error = false,
            label,
            shadow = false,
            ...props
        },
        ref
    ) => {
        const [inputValue, setInputValue] = React.useState<string | number | readonly string[] | undefined>(
            propValue || ""
        );

        const [showPassword, setShowPassword] = React.useState(false);
        const [isFocused, setIsFocused] = React.useState(false);
        const [isActive, setIsActive] = React.useState(false);

        const inputRef = React.useRef<HTMLInputElement>(null);
        const iconsBoxRef = React.useRef<HTMLSpanElement>(null);

        React.useEffect(() => {
            if (propValue !== undefined) {
                setInputValue(propValue);
            }
        }, [propValue]);

        React.useImperativeHandle(ref, () => inputRef.current!);

        const handleClear = (e: React.MouseEvent) => {
            e.preventDefault();
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

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            setIsActive(true); // Активируем div, когда input в фокусе
            setIsActive(true); // Активируем div, когда input в фокусе
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setIsActive(false);
            props.onBlur?.(e);
        };

        const showClearButton = React.useMemo(
            () => inputValue && isFocused && !disabled,
            [disabled, inputValue, isFocused]
        );

        React.useEffect(() => {
            const container = iconsBoxRef.current;

            if (container && container.lastElementChild) {
                (container.lastElementChild as HTMLElement).classList.add("!pr-[13.3px]", "rounded-r-md");
            }
        }, [showClearButton, error, type]);

        return (
            <div className="flex flex-col w-full gap-[4px]">
                {label && <label className="block text-note-1 text-neutral-80 dark:text-neutral-30 ">{label}</label>}
                <div
                    className={cn(
                        "relative flex items-center w-full border hover:border-green-40 ",
                        "border-neutral-40",
                        "dark:border-neutral-60",
                        shadow ? "shadow-1 rounded-md" : "",
                        isFocused || isActive ? "!border-green-50" : "",
                        disabled ? "border-neutral-40 hover:border-neutral-40" : "",
                        error ? "border-red-40 dark:border-red-40" : ""
                    )}>
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={cn(
                            "flex h-9 w-full px-3 py-2 rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none transition duration-200",
                            "text-neutral-80 bg-neutral-0",
                            "dark:text-neutral-0 dark:bg-neutral-100 dark:placeholder:text-neutral-70",
                            "disabled:bg-neutral-20 disabled:dark:bg-neutral-90 disabled:text-neutral-80 disabled:dark:text-neutral-60",
                            variant === InputTypes.GRAY ? "bg-white dark:bg-muted" : "",
                            className
                        )}
                        ref={inputRef}
                        {...props}
                    />
                    <span className="flex" ref={iconsBoxRef}>
                        {showClearButton && <ClearButton handleClear={handleClear} />}
                        {error && <ErrorBadge />}
                        {type === "password" && (
                            <EyeButton
                                disabled={disabled ?? false}
                                inputValue={inputValue}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        )}
                    </span>

                    {children && (
                        <div className="absolute right-3 top-0 bottom-0 flex items-center justify-center">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
