import { ExecutionMethodOutput, RetryPolicy, TimeoutConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useTranslate } from "react-admin";

interface IProviderMethodsTable {
    onEditClick: () => void;
    onDeleteClick: () => void;
    methodValue: ExecutionMethodOutput;
    disabledProcess: boolean;
}

const TableCellInObject = ({ value, rowIndex }: { value: string | string[] | undefined; rowIndex: number }) => {
    const currentValue = useMemo(() => {
        const timedeltaRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

        if (Array.isArray(value)) {
            return value.join(", ");
        } else if (typeof value === "string" && value?.match(timedeltaRegex)) {
            const matches = value.match(timedeltaRegex);

            const hours = matches && matches[1] ? String(matches[1]).padStart(2, "0") : "00";
            const minutes = matches && matches[2] ? String(matches[2]).padStart(2, "0") : "00";
            const seconds = matches && matches[3] ? String(matches[3]).padStart(2, "0") : "00";

            return `${hours}:${minutes}:${seconds}`;
        }

        return value || "-";
    }, [value]);

    return (
        <TableCell
            className={cn(
                "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                rowIndex % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
            )}>
            {currentValue}
        </TableCell>
    );
};

export const ProviderMethodsTable = ({
    methodValue,
    onEditClick,
    onDeleteClick,
    disabledProcess
}: IProviderMethodsTable) => {
    const translate = useTranslate();

    return (
        <div className="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow className="relative bg-green-50 hover:bg-green-50">
                        {["Key", "Subkey", "Value"].map((header, j) => {
                            return (
                                <TableHead
                                    key={j}
                                    className="border border-neutral-40 px-4 py-[9px] text-left text-base leading-4 text-white dark:border-muted">
                                    {header}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Object.keys(methodValue).map((key, rowIndex) =>
                        typeof methodValue[key as keyof ExecutionMethodOutput] === "object" ? (
                            Object.keys(
                                methodValue[key as keyof ExecutionMethodOutput] as TimeoutConfig | RetryPolicy
                            ).map((subkey, index) => (
                                <TableRow className="border-muted" key={subkey}>
                                    {index === 0 && (
                                        <TableCell
                                            rowSpan={
                                                Object.keys(
                                                    methodValue[key as keyof ExecutionMethodOutput] as
                                                        | TimeoutConfig
                                                        | RetryPolicy
                                                ).length
                                            }
                                            className={cn(
                                                "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                                                rowIndex % 2
                                                    ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                    : "bg-neutral-0 dark:bg-neutral-100"
                                            )}>
                                            {key}
                                        </TableCell>
                                    )}

                                    <TableCell
                                        className={cn(
                                            "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                                            rowIndex % 2
                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                : "bg-neutral-0 dark:bg-neutral-100"
                                        )}>
                                        {subkey}
                                    </TableCell>

                                    <TableCellInObject
                                        key={subkey}
                                        value={
                                            methodValue[key as keyof ExecutionMethodOutput]?.[
                                                subkey as keyof (TimeoutConfig | RetryPolicy)
                                            ]
                                        }
                                        rowIndex={rowIndex}
                                    />
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="border-muted" key={key}>
                                <TableCell
                                    colSpan={2}
                                    className={cn(
                                        "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                                        rowIndex % 2
                                            ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                            : "bg-neutral-0 dark:bg-neutral-100"
                                    )}>
                                    {key}
                                </TableCell>

                                <TableCell
                                    className={cn(
                                        "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                                        rowIndex % 2
                                            ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                            : "bg-neutral-0 dark:bg-neutral-100"
                                    )}>
                                    {methodValue[key as keyof ExecutionMethodOutput] as string}
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                <Button disabled={disabledProcess} onClick={onEditClick}>
                    {translate("app.ui.actions.edit")}
                </Button>

                <Button disabled={disabledProcess} onClick={onDeleteClick} variant={"outline_gray"}>
                    {translate("app.ui.actions.delete")}
                </Button>
            </div>
        </div>
    );
};
