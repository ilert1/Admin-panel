import { ExecutionMethodOutput, RetryPolicy, TimeoutConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslate } from "react-admin";

interface IProviderMethodsTable {
    onEditClick: () => void;
    onDeleteClick: () => void;
    methodValue: ExecutionMethodOutput;
    disabledProcess: boolean;
}

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

                                    <TableCell
                                        key={subkey}
                                        className={cn(
                                            "relative border border-neutral-40 bg-neutral-0 py-2 text-sm text-neutral-90 dark:border-muted dark:bg-neutral-100 dark:text-neutral-0",
                                            rowIndex % 2
                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                : "bg-neutral-0 dark:bg-neutral-100"
                                        )}>
                                        {methodValue[key as keyof ExecutionMethodOutput]?.[
                                            subkey as keyof (TimeoutConfig | RetryPolicy)
                                        ] || "-"}
                                    </TableCell>
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
