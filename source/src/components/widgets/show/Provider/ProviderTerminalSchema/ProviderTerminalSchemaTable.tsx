import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslate } from "react-admin";
import { BaseFieldConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { cn } from "@/lib/utils";
import { TextField } from "@/components/ui/text-field";
import { Checkbox } from "@/components/ui/checkbox";

interface IProviderTerminalSchemaTable {
    schemaValue: BaseFieldConfig;
    onEditClick: () => void;
    onDeleteClick: () => void;
    disabledProcess: boolean;
    disabledEditButton?: boolean;
    disabledDeleteButton?: boolean;
}

export const ProviderTerminalSchemaTable = ({
    schemaValue,
    onEditClick,
    onDeleteClick,
    disabledProcess,
    disabledEditButton,
    disabledDeleteButton
}: IProviderTerminalSchemaTable) => {
    const translate = useTranslate();

    return (
        <div className="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow className="relative bg-green-50 hover:bg-green-50">
                        {["Key", "Value"].map((header, j) => {
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

                {schemaValue &&
                    (Object.keys(schemaValue) as (keyof BaseFieldConfig)[]).map((key, rowIndex) => (
                        <TableBody key={key}>
                            <TableRow className="border-muted">
                                <TableCell
                                    className={cn(
                                        "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0 sm:w-80",
                                        rowIndex % 2
                                            ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                            : "bg-neutral-0 dark:bg-neutral-100"
                                    )}>
                                    {key}
                                </TableCell>

                                <TableCell
                                    className={cn(
                                        "relative min-h-11 border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                        rowIndex % 2
                                            ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                            : "bg-neutral-0 dark:bg-neutral-100"
                                    )}>
                                    {typeof schemaValue[key] === "boolean" ? (
                                        <Checkbox
                                            checked={schemaValue[key]}
                                            className="pointer-events-none cursor-default"
                                        />
                                    ) : (
                                        <TextField
                                            className="text-neutral-80 dark:text-neutral-40"
                                            text={schemaValue[key] || ""}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
            </Table>

            <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                <Button disabled={disabledProcess || disabledEditButton} onClick={onEditClick}>
                    {translate("app.ui.actions.edit")}
                </Button>

                <Button
                    className="disabled:bg-neutral-40 disabled:dark:bg-neutral-70"
                    disabled={disabledProcess || disabledDeleteButton}
                    onClick={onDeleteClick}
                    variant={"outline_gray"}>
                    {translate("app.ui.actions.delete")}
                </Button>
            </div>
        </div>
    );
};
