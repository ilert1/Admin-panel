import {
    ExecutionMethodOutput,
    RetryPolicy,
    BlowfishProtocolSchemasProviderTimeoutConfig
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ITableCellForObjectMethod {
    methodKey: keyof Pick<ExecutionMethodOutput, "retry_policy" | "timeouts">;
    methodValue: Pick<ExecutionMethodOutput, "retry_policy" | "timeouts">;
    rowIndex: number;
}

const SubCell = ({ value, rowIndex }: { value: string | string[] | undefined; rowIndex: number }) => {
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
        } else if (typeof value === "number") {
            return value;
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

export const TableCellForObjectMethod = ({ methodKey, methodValue, rowIndex }: ITableCellForObjectMethod) => {
    return Object.keys(methodValue[methodKey] as BlowfishProtocolSchemasProviderTimeoutConfig | RetryPolicy).map(
        (subkey, index) => (
            <TableRow className="border-muted" key={subkey}>
                {index === 0 && (
                    <TableCell
                        rowSpan={
                            Object.keys(
                                methodValue[methodKey] as BlowfishProtocolSchemasProviderTimeoutConfig | RetryPolicy
                            ).length
                        }
                        className={cn(
                            "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                            rowIndex % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                        )}>
                        {methodKey}
                    </TableCell>
                )}

                <TableCell
                    className={cn(
                        "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                        rowIndex % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                    )}>
                    {subkey}
                </TableCell>

                <SubCell
                    key={subkey}
                    value={
                        methodValue[methodKey]?.[
                            subkey as keyof (BlowfishProtocolSchemasProviderTimeoutConfig | RetryPolicy)
                        ]
                    }
                    rowIndex={rowIndex}
                />
            </TableRow>
        )
    );
};
