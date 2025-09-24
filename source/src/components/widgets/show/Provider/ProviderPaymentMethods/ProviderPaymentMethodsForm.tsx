import { PaymentMethodConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/Input/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProviderMethodsForm {
    methodValue: PaymentMethodConfig | null | undefined;
    disabledProcess: boolean;
    onChangeMethod: (value: PaymentMethodConfig) => void;
    onCancel: () => void;
}

export const ProviderPaymentMethodsForm = ({
    methodValue,
    onChangeMethod,
    onCancel,
    disabledProcess
}: IProviderMethodsForm) => {
    const translate = useTranslate();

    const formSchema = z.object({
        enabled: z.boolean().optional(),
        cancel: z.boolean().optional(),
        confirm: z.boolean().optional(),
        task_queue: z.string().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            enabled: methodValue?.enabled || false,
            cancel: methodValue?.cancel || false,
            confirm: methodValue?.confirm || false,
            task_queue: methodValue?.task_queue || ""
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onChangeMethod)}>
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

                    {methodValue &&
                        (Object.keys(methodValue) as (keyof PaymentMethodConfig)[]).map((methodKey, rowIndex) => (
                            <TableBody key={methodKey}>
                                <TableRow className="border-muted">
                                    <TableCell
                                        className={cn(
                                            "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                            rowIndex % 2
                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                : "bg-neutral-0 dark:bg-neutral-100"
                                        )}>
                                        {methodKey}
                                    </TableCell>

                                    <TableCell
                                        className={cn(
                                            "relative flex items-center justify-center border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                            rowIndex % 2
                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                : "bg-neutral-0 dark:bg-neutral-100"
                                        )}>
                                        {typeof methodValue[methodKey] === "boolean" && (
                                            <FormField
                                                control={form.control}
                                                name={methodKey}
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

                                        {methodKey === "task_queue" && (
                                            <FormField
                                                control={form.control}
                                                name={methodKey}
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
                            </TableBody>
                        ))}
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
