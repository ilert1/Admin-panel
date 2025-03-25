/* eslint-disable react/prop-types */
import * as React from "react";
import { cn } from "@/lib/utils";
import { ErrorBadge } from "./ErrorBadge";
import { EyeButton } from "./EyeButton";
import { ClearButton } from "./ClearButton";

export type BasicInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export enum InputTypes {
    DEFAULT = "default",
    GRAY = "gray"
}

export type LabelSize = "note-1" | "title-2" | "login-page";
export type BorderColor = "border-neutral-40" | "border-neutral-60";

interface InputProps extends BasicInputProps {
    variant?: InputTypes;
    label?: string;
    shadow?: boolean;
    error?: boolean | string;
    errorMessage?: string | React.ReactNode;
    labelSize?: LabelSize;
    borderColor?: BorderColor;
    disableErrorMessage?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            value: propValue,
            onChange,
            onContextMenu,
            disabled,
            variant = InputTypes.DEFAULT,
            error = false,
            errorMessage = "",
            label,
            labelSize = "note-1",
            shadow = false,
            borderColor = "border-neutral-40",
            disableErrorMessage = false,
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
        const containerRef = React.useRef<HTMLDivElement>(null);

        React.useImperativeHandle(ref, () => inputRef.current!);

        React.useEffect(() => {
            if (propValue !== undefined && propValue !== inputValue) {
                setInputValue(propValue);
            }
        }, [inputValue, propValue]);

        const handleClear = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setInputValue("");
            if (onChange) {
                const event = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
            inputRef.current?.focus();
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (propValue === undefined) {
                setInputValue(e.target.value);
            }
            onChange?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setTimeout(() => {
                if (document.activeElement !== inputRef.current) {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }
            }, 0);
        };

        const showClearButton = React.useMemo(
            () => inputValue?.toString() && isFocused && !disabled,
            [disabled, inputValue, isFocused]
        );

        React.useEffect(() => {
            const container = iconsBoxRef.current;

            if (container && container.lastElementChild) {
                const lastChild = container.lastElementChild as HTMLElement;
                if (lastChild) {
                    lastChild.classList.add("!pr-[13.3px]", "rounded-r-4");
                }
            }
        }, [showClearButton, error, type]);

        React.useEffect(() => {
            const handleDocumentClick = (e: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target as Node) &&
                    document.activeElement !== inputRef.current
                ) {
                    setIsFocused(false);
                    inputRef.current?.blur();
                    props.onBlur?.(e as any);
                }
            };

            document.addEventListener("click", handleDocumentClick);
            return () => {
                document.removeEventListener("click", handleDocumentClick);
            };
        }, [props]);

        return (
            <div className="flex w-full flex-col gap-[4px] rounded-4" ref={containerRef}>
                {label && (
                    <label
                        className={`block md:text-nowrap ${
                            labelSize === "login-page"
                                ? "text-note-1 text-neutral-80 dark:text-neutral-30"
                                : labelSize === "note-1"
                                  ? "text-note-1 text-neutral-60 dark:text-neutral-30"
                                  : "text-title-2 text-neutral-60 dark:text-neutral-0"
                        }`}>
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        "relative flex w-full items-center rounded-4 border transition-colors duration-200 hover:border-green-40 dark:border-neutral-60 hover:dark:border-green-40",
                        borderColor,
                        isFocused && "border-green-50",
                        shadow && "shadow-1",
                        error && "border-red-40 dark:border-red-40",
                        "bg-neutral-0 text-neutral-80 dark:bg-neutral-100 dark:text-neutral-0 dark:placeholder:text-neutral-70",
                        variant === InputTypes.GRAY && "gray-autofill bg-white dark:bg-muted",
                        disabled &&
                            "pointer-events-none bg-neutral-20 !text-neutral-80 dark:bg-neutral-90 dark:!text-neutral-60"
                    )}>
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        tabIndex={0}
                        value={propValue !== undefined ? propValue : inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        spellCheck="false"
                        className={cn(
                            "z-1 flex h-9 w-full rounded-4 bg-inherit px-3 py-2 text-sm text-inherit ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none",
                            type === "password_masked" && !showPassword && "input-masked",
                            className
                        )}
                        {...props}
                        onCopy={() =>
                            navigator.clipboard.writeText(String(propValue !== undefined ? propValue : inputValue))
                        }
                        onCut={() =>
                            navigator.clipboard.writeText(String(propValue !== undefined ? propValue : inputValue))
                        }
                        onContextMenu={type === "password_masked" ? e => e.preventDefault() : onContextMenu}
                        ref={inputRef}
                    />
                    <span className="flex" ref={iconsBoxRef}>
                        {showClearButton && <ClearButton handleClear={handleClear} inputVariant={variant} />}
                        {error && <ErrorBadge errorMessage={errorMessage} disableErrorMessage={disableErrorMessage} />}
                        {(type === "password" || type === "password_masked") && (
                            <EyeButton
                                inputVariant={variant}
                                disabled={disabled ?? false}
                                inputValue={inputValue}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        )}
                    </span>
                </div>
                {error && errorMessage && <span className="inline !text-note-1 text-red-40">{errorMessage}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
