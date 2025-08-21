import { ButtonHTMLAttributes, forwardRef, useRef, useState } from "react";
import { type VariantProps } from "class-variance-authority";
import { WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslate } from "react-admin";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AddCustomDialog } from "./AddCustomDialog";

import { MultiSelectButton } from "./MultiSelectButton";
import { MultiSelectCommand } from "./MultiSelectCommand";
import { multiSelectVariants, type MultiSelectOption } from "./MultiSelectTypes";
import { useMultiSelectLogic } from "./useMultiSelectLogic";

interface MultiSelectProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
    options: MultiSelectOption[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    animation?: number;
    modalPopover?: boolean;
    className?: string;
    selectedValues: string[];
    notFoundMessage?: string;
    isLoading?: boolean;
    addingNew?: boolean;
    disabled?: boolean;
    draggable?: boolean;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
    (
        {
            selectedValues,
            onValueChange,
            options,
            variant,
            placeholder = "Select options",
            animation = 0,
            modalPopover = false,
            notFoundMessage,
            className,
            isLoading = false,
            addingNew = false,
            disabled = false,
            draggable = false,
            ...props
        },
        ref
    ) => {
        const appToast = useAppToast();
        const translate = useTranslate();
        const commandList = useRef<HTMLDivElement>(null);

        const [isPopoverOpen, setIsPopoverOpen] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);
        const [inputValue, setInputValue] = useState("");
        const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

        const {
            localOptions,
            setLocalOptions,
            toggleOption,
            handleClear,
            toggleAll,
            areAllSelected,
            handleReorderValues
        } = useMultiSelectLogic({
            options,
            selectedValues,
            onValueChange,
            addingNew
        });

        const handleTogglePopover = () => {
            setIsPopoverOpen(prev => !prev);
        };

        const handleAddCustom = () => {
            setLocalOptions(prev => [...prev, { label: inputValue, value: inputValue }]);
            const newSelectedValues = [...selectedValues, inputValue];
            onValueChange(newSelectedValues);
            setInputValue("");
            appToast("success", translate("app.widgets.multiSelect.confirmDialog.optionAdded"));
        };

        const handleClearInput = () => {
            setInputValue("");
        };

        const showAddButton = addingNew && inputValue.length > 0;

        return (
            <>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
                    <PopoverTrigger asChild>
                        <MultiSelectButton
                            ref={ref}
                            {...props}
                            disabled={disabled}
                            draggable={draggable}
                            onClick={handleTogglePopover}
                            className={className}
                            selectedValues={selectedValues}
                            localOptions={localOptions}
                            options={options}
                            placeholder={placeholder}
                            isLoading={isLoading}
                            addingNew={addingNew}
                            variant={variant}
                            animation={animation}
                            isAnimating={isAnimating}
                            onToggleOption={toggleOption}
                            onClear={handleClear}
                            onReorderValues={handleReorderValues}
                        />
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        onEscapeKeyDown={() => setIsPopoverOpen(false)}
                        onCloseAutoFocus={e => {
                            e.preventDefault();
                            setInputValue("");
                        }}>
                        <MultiSelectCommand
                            ref={commandList}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            options={options}
                            selectedValues={selectedValues}
                            onToggleOption={toggleOption}
                            onToggleAll={toggleAll}
                            areAllSelected={areAllSelected}
                            modalPopover={modalPopover}
                            addingNew={addingNew}
                            notFoundMessage={notFoundMessage}
                            showAddButton={showAddButton}
                            onAddNew={() => {
                                if (!inputValue.match(/^[a-z0-9_.]+$/)) {
                                    appToast("error", translate("app.widgets.multiSelect.reqFieldRegex"));
                                    return;
                                }
                                if (selectedValues.includes(inputValue)) {
                                    appToast("error", translate("app.widgets.multiSelect.optionAlreadyExists"));
                                    return;
                                }
                                setConfirmDialogOpen(true);
                            }}
                        />
                    </PopoverContent>

                    {animation > 0 && selectedValues.length > 0 && (
                        <WandSparkles
                            data-testid="wand-sparkles"
                            className={cn(
                                "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
                                isAnimating ? "" : "text-muted-foreground"
                            )}
                            onClick={() => setIsAnimating(!isAnimating)}
                        />
                    )}
                </Popover>

                <AddCustomDialog
                    open={confirmDialogOpen}
                    onOpenChange={setConfirmDialogOpen}
                    onConfirm={handleAddCustom}
                    localOptions={localOptions}
                    code={inputValue}
                    clear={handleClearInput}
                />
            </>
        );
    }
);

MultiSelect.displayName = "MultiSelect";
