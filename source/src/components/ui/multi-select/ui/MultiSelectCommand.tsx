import { forwardRef, KeyboardEvent } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import { useTranslate } from "react-admin";

import { type MultiSelectOption } from "./MultiSelectTypes";

interface MultiSelectCommandProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    options: MultiSelectOption[];
    selectedValues: string[];
    onToggleOption: (value: string) => void;
    onToggleAll: () => void;
    areAllSelected: boolean;
    modalPopover: boolean;
    addingNew: boolean;
    notFoundMessage?: string;
    showAddButton: boolean;
    onAddNew: () => void;
}

export const MultiSelectCommand = forwardRef<HTMLDivElement, MultiSelectCommandProps>(
    (
        {
            inputValue,
            onInputChange,
            options,
            selectedValues,
            onToggleOption,
            onToggleAll,
            areAllSelected,
            modalPopover,
            addingNew,
            notFoundMessage,
            showAddButton,
            onAddNew
        },
        ref
    ) => {
        const translate = useTranslate();

        const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                // Handle enter key if needed
            }
        };

        const handleInputChange = (val: string) => {
            onInputChange(val);

            if (val.length === 0 && ref && "current" in ref && ref.current) {
                setTimeout(() => {
                    ref.current?.querySelector("[cmdk-item]")?.scrollIntoView({ block: "nearest" });
                }, 50);
            }
        };

        return (
            <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                <CommandInput
                    data-testid="command-input"
                    value={inputValue}
                    onValueChange={handleInputChange}
                    placeholder={
                        addingNew
                            ? translate("app.widgets.multiSelect.searchOrAddPlaceholder")
                            : translate("app.widgets.multiSelect.searchPlaceholder")
                    }
                    onKeyDown={handleInputKeyDown}
                />
                <CommandList ref={ref}>
                    {!addingNew && (
                        <CommandEmpty>
                            {notFoundMessage || translate("app.widgets.multiSelect.noResultFound")}
                        </CommandEmpty>
                    )}

                    <CommandGroup>
                        {options.length > 0 && (
                            <CommandItem
                                key="all"
                                onSelect={onToggleAll}
                                className={cn(
                                    "cursor-pointer data-[selected=true]:bg-neutral-50 dark:data-[selected=true]:bg-neutral-80",
                                    "bg-white hover:!bg-green-50 dark:hover:!bg-green-50",
                                    "text-neutral-90 hover:!text-white dark:text-neutral-0",
                                    modalPopover ? "dark:bg-muted" : "dark:bg-black"
                                )}>
                                <div
                                    className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-4 border border-neutral-60 bg-white dark:bg-black",
                                        areAllSelected
                                            ? "border-transparent bg-green-50 text-white dark:bg-green-50"
                                            : "opacity-50 [&_svg]:invisible"
                                    )}>
                                    <CheckIcon className="h-4 w-4" />
                                </div>
                                <span>({translate("app.widgets.multiSelect.selectAll")})</span>
                            </CommandItem>
                        )}

                        {options.map(option => {
                            const isSelected = selectedValues.includes(option.value);
                            return (
                                <CommandItem
                                    onKeyDownCapture={event => {
                                        event.preventDefault();
                                    }}
                                    key={option.value}
                                    onSelect={() => onToggleOption(option.value)}
                                    className={cn(
                                        "cursor-pointer data-[selected=true]:bg-neutral-50 dark:data-[selected=true]:bg-neutral-80",
                                        "bg-white hover:!bg-green-50 dark:hover:!bg-green-50",
                                        "text-neutral-90 hover:!text-white dark:text-neutral-0",
                                        modalPopover ? "dark:bg-muted" : "dark:bg-black"
                                    )}>
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-4 border border-neutral-60 bg-white dark:bg-black",
                                            isSelected
                                                ? "border-transparent bg-green-50 text-white dark:bg-green-50"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}>
                                        <CheckIcon className="h-4 w-4" />
                                    </div>
                                    {option.icon && <option.icon className="mr-2 text-muted-foreground" />}
                                    <span>{option.label}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>

                    <CommandSeparator />
                </CommandList>

                {showAddButton && (
                    <div className="p-2">
                        <Button className="w-full rounded-none" onClick={onAddNew}>
                            {translate("app.widgets.multiSelect.addNew")}
                        </Button>
                    </div>
                )}
            </Command>
        );
    }
);

MultiSelectCommand.displayName = "MultiSelectCommand";
