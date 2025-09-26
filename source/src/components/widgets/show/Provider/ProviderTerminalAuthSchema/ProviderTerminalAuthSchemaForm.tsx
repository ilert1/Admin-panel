import { BaseFieldConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProviderTerminalAuthSchemaForm {
    schemaKey?: string;
    schemaValue?: BaseFieldConfig;
    disabledProcess: boolean;
    onChangeMethod: (value: BaseFieldConfig) => void;
    onCancel: () => void;
}

export const ProviderTerminalAuthSchemaForm = ({
    schemaValue,
    schemaKey,
    onChangeMethod,
    onCancel,
    disabledProcess
}: IProviderTerminalAuthSchemaForm) => {
    const translate = useTranslate();

    const formSchema = z.object({
        key: z.string().min(1, translate("app.widgets.forms.payout.required")).trim(),
        required: z.boolean().optional(),
        description: z.string().optional(),
        default_value: z.string().optional(),
        validation_pattern: z.string().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: schemaKey || "",
            required: schemaValue?.required || true,
            description: schemaValue?.description || "",
            default_value: schemaValue?.default_value || "",
            validation_pattern: schemaValue?.validation_pattern || ""
        }
    });

    useEffect(() => {
        form.reset({
            ...form.getValues(),
            key: schemaKey || "",
            required: schemaValue?.required !== undefined ? schemaValue?.required : true,
            description: schemaValue?.description || "",
            default_value: schemaValue?.default_value || "",
            validation_pattern: schemaValue?.validation_pattern || ""
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onChangeMethod)}
                className={cn(
                    "flex flex-col gap-4 rounded-8 p-4",
                    schemaKey ? "bg-transparent" : "bg-neutral-20 dark:bg-neutral-bb"
                )}>
                <div className="flex flex-col gap-4 border-b border-neutral-90 pb-4 dark:border-neutral-100">
                    <p className="text-base text-neutral-90 dark:text-neutral-30">
                        {translate("resources.provider.terminalAuthSchema.schemaName")}
                    </p>

                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={disabledProcess}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

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

                    <TableBody>
                        {(Object.keys(formSchema.shape) as (keyof typeof formSchema.shape)[]).map(
                            (key, rowIndex) =>
                                key !== "key" && (
                                    <TableRow key={key} className="border-muted">
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
                                                "relative flex min-h-12 items-center justify-center border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                                rowIndex % 2
                                                    ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                    : "bg-neutral-0 dark:bg-neutral-100"
                                            )}>
                                            {typeof form.getValues(key) === "boolean" && (
                                                <FormField
                                                    control={form.control}
                                                    name={key}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value as boolean}
                                                                    onCheckedChange={() => field.onChange(!field.value)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            {typeof form.getValues(key) === "string" && (
                                                <FormField
                                                    control={form.control}
                                                    name={key}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    value={field.value as string}
                                                                    onChange={field.onChange}
                                                                    disabled={disabledProcess}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                        )}
                    </TableBody>
                </Table>

                <div className="flex flex-wrap justify-end gap-2 md:gap-4">
                    <Button type="submit">{translate("app.ui.actions.save")}</Button>

                    <Button onClick={onCancel} variant={"outline_gray"}>
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
