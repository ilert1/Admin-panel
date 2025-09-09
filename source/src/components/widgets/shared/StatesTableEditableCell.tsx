import { Button } from "@/components/ui/Button";
import { LoadingBalance } from "@/components/ui/loading";
import { Cell } from "@tanstack/react-table";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import { CurrentCell } from "./TableEditableCell";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clsx } from "clsx";

interface IStatesEditableCell<States extends string, Data> {
    initValue: States;
    selectVariants: States[];
    cell: Cell<Data, unknown>;
    showEdit: boolean;
    setShowEdit: (val: CurrentCell) => void;
    onSubmit: (val: States) => void;
    isFetching?: boolean;
    editDisabled?: boolean;
}

export function StatesTableEditableCell<States extends string, Data>({
    initValue,
    selectVariants,
    cell,
    showEdit,
    setShowEdit,
    onSubmit,
    isFetching,
    editDisabled
}: IStatesEditableCell<States, Data>) {
    const translate = useTranslate();
    const [value, setValue] = useState(initValue);

    const onExit = () => {
        setShowEdit({ row: undefined, column: undefined });
        setValue(initValue);
    };

    const onSave = () => {
        if (value !== initValue) {
            onSubmit(value);
        } else {
            onExit();
        }
    };

    return (
        <div className="flex w-full min-w-36 items-center gap-2">
            {showEdit ? (
                <>
                    <Select value={value} onValueChange={val => setValue(val as States)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {selectVariants.map(state => (
                                    <SelectItem value={state} key={state}>
                                        {translate(`resources.cascadeSettings.cascades.state.${state}`)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className="flex flex-col items-center">
                        {isFetching ? (
                            <div data-testid="loading-spinner" className="flex items-center justify-center">
                                <LoadingBalance className="h-6 w-6 overflow-hidden" />
                            </div>
                        ) : (
                            <>
                                <Button
                                    data-testid="x-icon"
                                    disabled={isFetching}
                                    onClick={onExit}
                                    variant="secondary"
                                    className="h-auto p-0 text-red-50 hover:text-red-40 disabled:bg-transparent">
                                    <X className="h-5" />
                                </Button>
                                <Button
                                    data-testid="check-icon"
                                    onClick={onSave}
                                    variant="secondary"
                                    className="h-auto p-0">
                                    <Check className="h-5" />
                                </Button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div
                        className={clsx(
                            "mr-4 flex w-full items-center justify-center text-white",
                            editDisabled && "grayscale"
                        )}>
                        <span
                            onDoubleClick={() => setShowEdit({ row: cell.row.index, column: cell.column.getIndex() })}
                            className={clsx(
                                "w-full whitespace-nowrap rounded-20 px-3 py-0.5 text-center text-title-2 font-normal",
                                initValue === "active" && "bg-green-50",
                                initValue === "inactive" && "bg-red-50",
                                initValue === "archived" && "bg-extra-2"
                            )}>
                            {translate(`resources.cascadeSettings.cascades.state.${initValue}`)}
                        </span>
                    </div>

                    <Button
                        disabled={editDisabled}
                        data-testid="pencil-icon"
                        onClick={() => setShowEdit({ row: cell.row.index, column: cell.column.getIndex() })}
                        variant="secondary"
                        className="absolute right-2 top-2 flex h-auto items-center p-0 disabled:bg-transparent">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    );
}
