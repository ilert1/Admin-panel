import { ExecutionMethodOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ITableCellForStringMethod {
    methodKey: keyof Pick<ExecutionMethodOutput, "type" | "execution_name" | "task_queue">;
    methodValue: Pick<ExecutionMethodOutput, "type" | "execution_name" | "task_queue">;
    rowIndex: number;
}

export const TableCellForStringMethod = ({ methodKey, methodValue, rowIndex }: ITableCellForStringMethod) => {
    return (
        <TableRow className="border-muted">
            <TableCell
                colSpan={2}
                className={cn(
                    "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                    rowIndex % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                )}>
                {methodKey}
            </TableCell>

            <TableCell
                className={cn(
                    "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                    rowIndex % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                )}>
                {methodValue[methodKey]}
            </TableCell>
        </TableRow>
    );
};
