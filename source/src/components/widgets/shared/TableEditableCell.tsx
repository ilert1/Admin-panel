import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { LoadingBalance } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Cell } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CurrentCell = { row: number | undefined; column: number | undefined };

interface IEditableCell<T> {
    initValue: string;
    cell: Cell<T, unknown>;
    showEdit: boolean;
    setShowEdit: (val: CurrentCell) => void;
    onSubmit: (val: string) => void;
    isFetching?: boolean;
}

export function TableEditableCell<T>({
    initValue,
    cell,
    showEdit,
    setShowEdit,
    onSubmit,
    isFetching
}: IEditableCell<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(initValue);

    const onExit = () => {
        setShowEdit({ row: undefined, column: undefined });
        setValue(initValue);
    };

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSubmit(value);
        } else if (e.key === "Escape") {
            onExit();
        }
    };

    useEffect(() => {
        if (showEdit) {
            inputRef?.current?.focus();
            inputRef?.current?.select();
        }
    }, [showEdit]);

    return (
        <div className="flex w-full max-w-48 items-center gap-2">
            {showEdit ? (
                <>
                    <Input
                        ref={inputRef}
                        onKeyDown={onKeyPress}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />

                    <div className="flex flex-col items-center">
                        {isFetching ? (
                            <div className="flex items-center justify-center">
                                <LoadingBalance className="h-6 w-6 overflow-hidden" />
                            </div>
                        ) : (
                            <>
                                <Button
                                    disabled={isFetching}
                                    onClick={onExit}
                                    variant="secondary"
                                    className="h-auto p-0 text-red-50 hover:text-red-40 disabled:bg-transparent">
                                    <X className="h-5" />
                                </Button>
                                <Button onClick={() => onSubmit(value)} variant="secondary" className="h-auto p-0">
                                    <Check className="h-5" />
                                </Button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <TextField
                    type="text"
                    onDoubleClick={() => setShowEdit({ row: cell.row.index, column: cell.column.getIndex() })}
                    lineClamp
                    text={initValue}
                />
            )}
        </div>
    );
}
