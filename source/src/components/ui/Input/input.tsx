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
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            props.onBlur?.(e);
        };

        const showClearButton = React.useMemo(
            () => inputValue && isFocused && !disabled,
            [disabled, inputValue, isFocused]
        );

        const inputRightBorder = showClearButton || error || type === "password";

        React.useEffect(() => {
            const container = iconsBoxRef.current;

            if (container && container.lastElementChild) {
                (container.lastElementChild as HTMLElement).classList.add(
                    "!pr-[13.3px]",
                    "border",
                    "border-r-[1px]",
                    "rounded-r-md"
                );
            }
        }, [showClearButton, error, type]);

        return (
            <div className="flex flex-col w-full gap-[4px]">
                {label && <label className="block text-note-1 text-neutral-30">{label}</label>}
                <div
                    className={cn(
                        "relative flex items-center w-full hover:border hover:border-green-50",
                        shadow ? "shadow-1 rounded-md" : ""
                    )}>
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={cn(
                            "flex h-9 w-full px-3 py-2 border border-r-0 !rounded-l-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none transition duration-200",
                            "text-neutral-80 bg-neutral-0 border-neutral-40 hover:border-green-50 active:border-green-50 focus:border-green-50 placeholder:text-neutral-60 disabled:text-neutral-70 !text-neutral-80",
                            "dark:bg-neutral-100 dark:border-neutral-60 dark:!text-white",
                            `disabled:border-neutral-40 disabled:dark:bg-neutral-10 disabled:bg-neutral-10 transition duration-200 !text-neutral-80 dark:!text-white ${
                                variant === InputTypes.GRAY ? "bg-white dark:bg-muted" : ""
                            }`,
                            !inputRightBorder ? "!border-r-[1px] rounded-md" : "border-r-0 rounded-l-md",
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
