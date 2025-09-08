import { useEffect, useState } from "react";
import { MultiSelectOption } from "./MultiSelectTypes";

interface UseMultiSelectLogicProps {
    options: MultiSelectOption[];
    selectedValues: string[];
    onValueChange: (value: string[]) => void;
    addingNew: boolean;
}

export const useMultiSelectLogic = ({
    options,
    selectedValues,
    onValueChange,
    addingNew
}: UseMultiSelectLogicProps) => {
    const [localOptions, setLocalOptions] = useState(options);

    useEffect(() => {
        if (addingNew) {
            const mergedOptions = [
                ...options,
                ...localOptions.filter(localOpt => !options.some(opt => opt.value === localOpt.value)),
                ...selectedValues
                    .filter(val => !options.some(opt => opt.value === val))
                    .filter(val => !localOptions.some(opt => opt.value === val))
                    .map(val => ({
                        label: val,
                        value: val
                    }))
            ];
            setLocalOptions(mergedOptions);
        } else {
            setLocalOptions(options);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, selectedValues, addingNew]);

    const toggleOption = (option: string) => {
        const isSelected = selectedValues.includes(option);
        const isCustomOption = !options.some(o => o.value === option);

        if (isSelected) {
            const newSelected = selectedValues.filter(v => v !== option);
            onValueChange(newSelected);

            if (isCustomOption) {
                setLocalOptions(prev => prev.filter(o => o.value !== option));
            }
        } else {
            const newSelected = [...selectedValues, option];
            onValueChange(newSelected);
        }
    };

    const handleClear = () => {
        onValueChange([]);
    };

    const toggleAll = () => {
        const originalValues = localOptions.map(option => option.value);
        const areAllSelected = originalValues.every(val => selectedValues.includes(val));

        if (areAllSelected) {
            onValueChange([]);
            setLocalOptions(options);
        } else {
            onValueChange(originalValues);
        }
    };

    const handleReorderValues = (fromIndex: number, toIndex: number) => {
        const reorderedValues = [...selectedValues];
        const [movedItem] = reorderedValues.splice(fromIndex, 1);
        reorderedValues.splice(toIndex, 0, movedItem);
        onValueChange(reorderedValues);
    };

    const areAllSelected = selectedValues.length === localOptions.length;

    return {
        localOptions,
        setLocalOptions,
        toggleOption,
        handleClear,
        toggleAll,
        areAllSelected,
        handleReorderValues
    };
};
