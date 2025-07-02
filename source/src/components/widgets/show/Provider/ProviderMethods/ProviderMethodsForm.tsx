import { ExecutionMethodInput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
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
    methodValue?: ExecutionMethodInput;
    disabledProcess: boolean;
    onChangeMethod: (key: string, value: ExecutionMethodInput) => void;
    onCancel: () => void;
}

export const ProviderMethodsForm = ({
    methodValue,
    methodKey,
    onChangeMethod,
    onCancel,
    disabledProcess
}: IProviderMethodsForm) => {
    const translate = useTranslate();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        execution_name: z.string().min(1, translate("resources.provider.errors.name")).trim(),
        retry_policy: z.object({
            backoff_coefficient: z.coerce.number().optional(),
            initial_interval: z.coerce.number().optional(),
            maximum_attempts: z.coerce
                .number()
                .min(1, translate("app.widgets.forms.payout.valueMinMessage"))
                .optional(),
            maximum_interval: z.coerce.number().optional(),
            non_retryable_error_types: z.string().optional()
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
                non_retryable_error_types: methodValue?.retry_policy?.non_retryable_error_types?.join(", ") || undefined
            },
            task_queue: methodValue?.task_queue || "",
            timeouts: {
                start_to_close_timeout: methodValue?.timeouts?.start_to_close_timeout || undefined,
                wait_condition_timeout: methodValue?.timeouts?.wait_condition_timeout || undefined
            },
            type: methodValue?.type || ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        onChangeMethod(data.name, {
            execution_name: data.execution_name,
            type: data.type,
            task_queue: data.task_queue,
            timeouts: {
                start_to_close_timeout: data.timeouts.start_to_close_timeout || undefined,
                wait_condition_timeout: data.timeouts.wait_condition_timeout || undefined
            },
            retry_policy: {
                ...data.retry_policy,
                non_retryable_error_types: data.retry_policy.non_retryable_error_types
                    ?.split(",")
                    .map(item => item.trim())
            }
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
                <div className="flex flex-col gap-4">
                    <p className="text-base text-neutral-90 dark:text-neutral-30">
                        {translate("resources.provider.methodName")}
                    </p>

                    <FormField
                        disabled={disabledProcess}
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
                    <p className="col-span-7 text-base text-neutral-90 dark:text-neutral-40">
                        {translate("resources.provider.methodParameters")}
                    </p>

                    <div className="col-span-4 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="execution_name" />
                    </div>

                    <FormField
                        disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                        disabled={disabledProcess}
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
                            disabled={disabledProcess}
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
                            disabled={disabledProcess}
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

                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-4 flex flex-col gap-4">
                        <Input disabled className="text-neutral-80 dark:text-neutral-40" value="type" />
                    </div>

                    <FormField
                        disabled={disabledProcess}
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
                    <Button disabled={disabledProcess} type="submit">
                        {translate("app.ui.actions.save")}
                    </Button>

                    <Button disabled={disabledProcess} onClick={onCancel} variant={"outline_gray"}>
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
