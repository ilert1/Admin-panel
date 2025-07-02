import { ExecutionMethodInput, ExecutionMethodOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProviderMethodsForm {
    methodKey?: string;
    methodValue?: ExecutionMethodOutput;
    onChangeMethod: (key: string, value: ExecutionMethodInput) => void;
    onCancel: () => void;
}

export const ProviderMethodsForm = ({ methodValue, methodKey, onChangeMethod, onCancel }: IProviderMethodsForm) => {
    const translate = useTranslate();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        execution_name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        retry_policy: z.object({
            backoff_coefficient: z.number().optional(),
            initial_interval: z.number().optional(),
            maximum_attempts: z.number().optional(),
            maximum_interval: z.number().optional(),
            non_retryable_error_types: z.array(z.string()).optional()
        }),
        task_queue: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        timeouts: z.object({
            start_to_close_timeout: z.string().trim().optional(),
            wait_condition_timeout: z.string().trim().optional()
        }),
        type: z.string().min(1, translate("resources.provider.errors.name")).trim()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: methodKey || "",
            execution_name: methodValue?.execution_name || "",
            retry_policy: {
                backoff_coefficient: methodValue?.retry_policy?.backoff_coefficient,
                initial_interval: methodValue?.retry_policy?.initial_interval,
                maximum_attempts: methodValue?.retry_policy?.maximum_attempts,
                maximum_interval: methodValue?.retry_policy?.maximum_interval || undefined,
                non_retryable_error_types: methodValue?.retry_policy?.non_retryable_error_types || undefined
            },
            task_queue: methodValue?.task_queue || "",
            timeouts: {
                start_to_close_timeout: methodValue?.timeouts?.start_to_close_timeout || "",
                wait_condition_timeout: methodValue?.timeouts?.wait_condition_timeout || ""
            },
            type: methodValue?.type || ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        onChangeMethod(data.name, {
            execution_name: data.execution_name,
            type: data.type,
            task_queue: data.task_queue,
            timeouts: { ...data.timeouts },
            retry_policy: { ...data.retry_policy }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "flex flex-col gap-4 rounded-8 p-4",
                    methodKey ? "bg-transparent" : "bg-neutral-20 dark:bg-neutral-bb"
                )}>
                <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4">
                    <p className="text-base text-neutral-90 dark:text-neutral-30">
                        {translate("resources.provider.methodName")}
                    </p>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-4 flex flex-col gap-4">
                        <p className="text-base text-neutral-90 dark:text-neutral-40">
                            {translate("resources.provider.methodParameters")}
                        </p>

                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="execution_name" />
                    </div>

                    <FormField
                        control={form.control}
                        name="execution_name"
                        render={({ field, fieldState }) => (
                            <FormItem className="col-span-3 flex flex-col self-end">
                                <FormControl>
                                    <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-2">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="retry_policy" />
                    </div>

                    <div className="col-span-2 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="backoff_coefficient" />
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="initial_interval" />
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="maximum_attempts" />
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="maximum_interval" />
                        <Input
                            disabled
                            className="text-neutral-80 dark:text-neutral-40"
                            value="non_retryable_error_types"
                        />
                    </div>

                    <div className="col-span-3 flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="retry_policy.backoff_coefficient"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.initial_interval"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.maximum_attempts"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.maximum_interval"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.non_retryable_error_types"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-4 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="task_queue" />
                    </div>

                    <FormField
                        control={form.control}
                        name="task_queue"
                        render={({ field, fieldState }) => (
                            <FormItem className="col-span-3 flex flex-col gap-4">
                                <FormControl>
                                    <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-2 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="timeouts" />
                    </div>

                    <div className="col-span-2 flex flex-col gap-4">
                        <Input
                            disabled
                            className="text-neutral-80 dark:text-neutral-40"
                            value="start_to_close_timeout"
                        />
                        <Input
                            disabled
                            className="text-neutral-80 dark:text-neutral-40"
                            value="wait_condition_timeout"
                        />
                    </div>

                    <div className="col-span-3 flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="timeouts.start_to_close_timeout"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timeouts.wait_condition_timeout"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4 border-b border-neutral-100 pb-4">
                    <div className="col-span-4 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="type" />
                    </div>

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <FormItem className="col-span-3 flex flex-col gap-4">
                                <FormControl>
                                    <Input {...field} error={fieldState.invalid} errorMessage={<FormMessage />} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

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
