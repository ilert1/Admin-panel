import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/Button";
import { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ErrorBadge } from "@/components/ui/Input/ErrorBadge";
import { PaymentTypeIcon } from "../PaymentTypeIcon";

export interface IPopoverSelect {
    value: string;
    setIdValue?: (value: string) => void;
    idField?: string;
    onChange: (value: string) => void;
    isError?: boolean;
    errorMessage?: string | ReactNode;
    disabled?: boolean;
}

interface PopoverSelectProps {
    value: string;
    setIdValue?: (value: string) => void;
    idField?: string;
    onChange: (value: string) => void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: any[];
    variantKey: string;
    variantTitleKey?: string;

    notFoundMessage: string;
    commandPlaceholder?: string;

    isError?: boolean;
    errorMessage?: string | React.ReactNode;
    disabled?: boolean;
    style?: "Grey" | "Black";
    iconForPaymentTypes?: boolean;
}

export const PopoverSelect = (props: PopoverSelectProps) => {
    const {
        value,
        idField,
        variants,
        variantKey,
        variantTitleKey,
        notFoundMessage,
        isError,
        errorMessage = "",
        disabled = false,
        commandPlaceholder = "",
        style = "Grey",
        iconForPaymentTypes = false,
        onChange,
        setIdValue
    } = props;
    const [open, setOpen] = useState(false);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="mt-0" disabled={disabled}>
                <Button
                    variant={"outline_gray"}
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        style === "Black"
                            ? "bg-black hover:!bg-white hover:dark:!bg-black"
                            : "!bg-white hover:!bg-white dark:!bg-muted hover:dark:!bg-muted",
                        `!mt-[0px] flex h-[38px] w-full items-center justify-between rounded-4 border px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 disabled:dark:bg-neutral-90 disabled:dark:!text-neutral-60 [&>span]:line-clamp-1`,
                        "[&:is([data-state='open'])]:border-green-50 [&:is([data-state='open'])]:text-neutral-80 [&:is([data-state='open'])]:dark:text-neutral-0 [&:is([data-state='open'])_#selectToggleIcon]:rotate-180 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70",
                        "border-neutral-40 bg-neutral-0 text-neutral-80 active:border-green-50 dark:border-neutral-60 dark:bg-neutral-100 dark:text-neutral-40",
                        "hover:!border-green-20 dark:hover:text-neutral-40",
                        isError ? "!border-red-40 dark:!border-red-40" : ""
                    )}>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex flex-wrap items-center">{value}</div>

                        <div className="flex items-center justify-between">
                            {value && (
                                <>
                                    <XIcon
                                        className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                        onClick={event => {
                                            event.stopPropagation();

                                            onChange("");

                                            if (setIdValue) {
                                                setIdValue("");
                                            }
                                        }}
                                    />
                                    <Separator orientation="vertical" className="flex h-full min-h-6" />{" "}
                                </>
                            )}
                            <ChevronDown
                                id="selectToggleIcon"
                                className="ml-2 h-4 w-4 cursor-pointer text-green-50 transition-transform dark:text-green-40"
                            />
                            {isError && (
                                <ErrorBadge
                                    errorMessage={errorMessage}
                                    className="ml-2 !flex h-4 items-center justify-center"
                                />
                            )}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={commandPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{notFoundMessage}</CommandEmpty>
                        <CommandGroup>
                            {variants.map(variant => (
                                <CommandItem
                                    className="bg-muted"
                                    key={variant[variantKey]}
                                    value={variant[variantKey]}
                                    onSelect={currentValue => {
                                        onChange(currentValue === value ? "" : currentValue);

                                        if (setIdValue && idField) {
                                            const variantId = variants.find(el => el[variantKey] === currentValue)[
                                                idField
                                            ];
                                            setIdValue(variantId);
                                        }

                                        setOpen(false);
                                    }}>
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === variant[variantKey] ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <>
                                        {iconForPaymentTypes ? (
                                            <PaymentTypeIcon type={variant[variantKey]} className="mr-2" />
                                        ) : (
                                            ""
                                        )}
                                        {variantTitleKey ? variant[variantTitleKey] : variant[variantKey]}
                                    </>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
