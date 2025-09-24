import {
    DeliveryStrategyEnum,
    ResponsePolicyTypeEnum,
    RetryStrategy
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ToggleActiveUser } from "@/components/ui/toggle-active-user";
import { ProvidersDataProvider } from "@/data";
import { ProviderUpdateParams } from "@/data/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DELIVERY_STRATEGY = Object.values(DeliveryStrategyEnum);
const RETRY_STRATEGY = Object.values(RetryStrategy);
const RESPONSE_POLICY_TYPE = Object.values(ResponsePolicyTypeEnum);

interface IProvidersDeliveryPolicyEdit {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProvidersDeliveryPolicyEdit = ({ id, onOpenChange }: IProvidersDeliveryPolicyEdit) => {
    const providersDataProvider = new ProvidersDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [isFinished, setIsFinished] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);

    const {
        data: provider,
        isLoading: isLoadingProvider,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["provider", id],
        queryFn: ({ signal }) => providersDataProvider.getOne("provider", { id: id ?? "", signal }),
        enabled: true,
        select: data => data.data
    });

    const formSchema = z.object({
        strategy: z.enum([DELIVERY_STRATEGY[0], ...DELIVERY_STRATEGY.slice(0)]).default(DELIVERY_STRATEGY[0]),
        timeout_config: z.object({
            rpc_timeout: z.coerce
                .number({ message: translate("resources.currency.errors.intOnly") })
                .int({ message: translate("resources.currency.errors.intOnly") })
                .min(1, translate("resources.callbridge.mapping.fields.delivery_policy.errors.minValue"))
                .max(
                    600,
                    translate("resources.callbridge.mapping.fields.delivery_policy.errors.maxCustomValue", {
                        value: 600
                    })
                )
                .default(180)
                .optional(),
            async_timeout: z.coerce
                .number({ message: translate("resources.currency.errors.intOnly") })
                .int({ message: translate("resources.currency.errors.intOnly") })
                .min(1, translate("resources.callbridge.mapping.fields.delivery_policy.errors.minValue"))
                .max(
                    3600,
                    translate("resources.callbridge.mapping.fields.delivery_policy.errors.maxCustomValue", {
                        value: 3600
                    })
                )
                .default(300)
                .optional()
        }),
        retry_policy: z.object({
            enabled: z.boolean().default(true),
            max_attempts: z
                .literal("")
                .transform(() => undefined)
                .or(
                    z.coerce
                        .number({ message: translate("resources.currency.errors.intOnly") })
                        .int({ message: translate("resources.currency.errors.intOnly") })
                        .min(1, translate("resources.callbridge.mapping.fields.delivery_policy.errors.minValue"))
                        .max(
                            100,
                            translate("resources.callbridge.mapping.fields.delivery_policy.errors.maxCustomValue", {
                                value: 100
                            })
                        )
                        .default(5)
                )
                .optional(),
            base_delay: z
                .literal("")
                .transform(() => undefined)
                .or(
                    z.coerce
                        .number({ message: translate("resources.currency.errors.intOnly") })
                        .int({ message: translate("resources.currency.errors.intOnly") })
                        .min(1, translate("resources.callbridge.mapping.fields.delivery_policy.errors.minValue"))
                        .max(
                            3600,
                            translate("resources.callbridge.mapping.fields.delivery_policy.errors.maxCustomValue", {
                                value: 3600
                            })
                        )
                        .default(10)
                )
                .optional(),
            backoff_multiplier: z
                .literal("")
                .transform(() => undefined)
                .or(
                    z.coerce
                        .number({ message: translate("resources.currency.errors.intOnly") })
                        .int({ message: translate("resources.currency.errors.intOnly") })
                        .min(1, translate("resources.callbridge.mapping.fields.delivery_policy.errors.minValue"))
                        .max(
                            10,
                            translate("resources.callbridge.mapping.fields.delivery_policy.errors.maxCustomValue", {
                                value: 10
                            })
                        )
                        .default(2)
                )
                .optional(),
            strategy: z.enum([RETRY_STRATEGY[0], ...RETRY_STRATEGY.slice(0)]).default(RETRY_STRATEGY[1])
        }),
        response_policy: z.object({
            type: z.enum([RESPONSE_POLICY_TYPE[0], ...RESPONSE_POLICY_TYPE.slice(0)]).default(RESPONSE_POLICY_TYPE[1]),
            template: z.object({
                headers: z.string().trim().optional(),
                body: z.string().trim().optional()
            })
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            strategy: DELIVERY_STRATEGY[0],
            timeout_config: {
                rpc_timeout: 180,
                async_timeout: 300
            },
            retry_policy: {
                enabled: true,
                max_attempts: 5,
                base_delay: 10,
                backoff_multiplier: 2,
                strategy: RETRY_STRATEGY[1]
            },
            response_policy: {
                type: RESPONSE_POLICY_TYPE[1],
                template: {
                    headers: "{}",
                    body: ""
                }
            }
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                strategy: provider.settings?.callback?.delivery_policy?.strategy,
                timeout_config: {
                    rpc_timeout: provider.settings?.callback?.delivery_policy?.timeout_config?.rpc_timeout,
                    async_timeout: provider.settings?.callback?.delivery_policy?.timeout_config?.async_timeout
                },
                retry_policy: {
                    enabled: provider.settings?.callback?.delivery_policy?.retry_policy?.enabled,
                    max_attempts: provider.settings?.callback?.delivery_policy?.retry_policy?.max_attempts,
                    base_delay: provider.settings?.callback?.delivery_policy?.retry_policy?.base_delay,
                    backoff_multiplier: provider.settings?.callback?.delivery_policy?.retry_policy?.backoff_multiplier,
                    strategy: provider.settings?.callback?.delivery_policy?.retry_policy?.strategy
                },
                response_policy: {
                    type: provider.settings?.callback?.delivery_policy?.response_policy?.type,
                    template: {
                        headers: JSON.stringify(
                            provider.settings?.callback?.delivery_policy?.response_policy?.template?.headers || {},
                            null,
                            2
                        ),
                        body: provider.settings?.callback?.delivery_policy?.response_policy?.template?.body || ""
                    }
                }
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, isLoadingProvider, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await providersDataProvider.update("provider", {
                id,
                data: {
                    settings: {
                        callback: {
                            adapter_nats_subject: provider?.settings?.callback?.adapter_nats_subject ?? "",
                            callback_nats_queue: provider?.settings?.callback?.callback_nats_queue ?? "",
                            security_policy: provider?.settings?.callback?.security_policy,
                            delivery_policy: {
                                ...data,
                                response_policy: {
                                    ...data.response_policy,
                                    template: {
                                        ...data.response_policy.template,
                                        headers:
                                            data.response_policy.template.headers &&
                                            data.response_policy.template.headers.length !== 0
                                                ? JSON.parse(data.response_policy.template.headers)
                                                : {}
                                    }
                                }
                            }
                        }
                    }
                },
                previousData: {
                    ...provider,
                    payment_types: provider?.payment_types.map(pt => pt.code) || []
                } as ProviderUpdateParams
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (isLoadingProvider || !provider || !isFinished) {
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-x-4 p-2 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="strategy"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>
                                    {translate("resources.callbridge.mapping.fields.delivery_policy.strategy")}
                                </Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {DELIVERY_STRATEGY.map(strategy => (
                                                <SelectItem value={strategy} variant={SelectType.GRAY} key={strategy}>
                                                    {translate(
                                                        `resources.callbridge.mapping.fields.delivery_policy.strategies.${strategy}`
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timeout_config.rpc_timeout"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate(
                                            "resources.callbridge.mapping.fields.delivery_policy.timeout_config.rpc_timeout"
                                        )}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timeout_config.async_timeout"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate(
                                            "resources.callbridge.mapping.fields.delivery_policy.timeout_config.async_timeout"
                                        )}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="mt-5 grid gap-4 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:col-span-3 md:grid-cols-4">
                        <div className="flex items-center gap-4 md:col-span-4">
                            <h4 className="text-display-4 text-neutral-90 dark:text-neutral-0">
                                {translate("resources.callbridge.mapping.fields.retry_policy")}
                            </h4>

                            <FormField
                                control={form.control}
                                name="retry_policy.enabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-end gap-2">
                                        <FormControl>
                                            <button
                                                type="button"
                                                className="flex items-center"
                                                onClick={() => field.onChange(!field.value)}>
                                                <ToggleActiveUser active={field.value} />
                                            </button>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="retry_policy.strategy"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.callbridge.mapping.fields.strategy")}</Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {RETRY_STRATEGY.map(strategy => (
                                                    <SelectItem
                                                        value={strategy}
                                                        variant={SelectType.GRAY}
                                                        key={strategy}>
                                                        {translate(
                                                            `resources.callbridge.mapping.fields.strategies.${strategy}`
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.base_delay"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.callbridge.mapping.fields.base_delay")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.max_attempts"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.callbridge.mapping.fields.max_attempts")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="retry_policy.backoff_multiplier"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.callbridge.mapping.fields.backoff_multiplier")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-5 flex flex-col gap-4 border-t-[1px] border-neutral-90 pt-5 dark:border-neutral-100 md:col-span-3">
                        <h4 className="text-display-4 text-neutral-90 dark:text-neutral-0 md:col-span-2">
                            {translate("resources.callbridge.mapping.fields.delivery_policy.response_policy.name")}
                        </h4>

                        <FormField
                            control={form.control}
                            name="response_policy.type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>
                                        {translate(
                                            "resources.callbridge.mapping.fields.delivery_policy.response_policy.type"
                                        )}
                                    </Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {RESPONSE_POLICY_TYPE.map(type => (
                                                    <SelectItem value={type} variant={SelectType.GRAY} key={type}>
                                                        {translate(
                                                            `resources.callbridge.mapping.fields.delivery_policy.response_policy.types.${type}`
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {form.getValues("response_policy.type") === "FROM_RESPONSE" && (
                            <FormField
                                control={form.control}
                                name="response_policy.template.headers"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="col-span-1 sm:col-span-2">
                                            <Label>
                                                {translate(
                                                    "resources.callbridge.mapping.fields.delivery_policy.response_policy.template"
                                                ) + " (response_headers)"}
                                            </Label>
                                            <FormControl>
                                                <MonacoEditor
                                                    onErrorsChange={setHasErrors}
                                                    onValidChange={setIsValid}
                                                    onMountEditor={() => setMonacoEditorMounted(true)}
                                                    code={field.value ?? "{}"}
                                                    setCode={field.onChange}
                                                    allowEmptyValues
                                                    height={"h-48"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}

                        {form.getValues("response_policy.type") === "FROM_TEMPLATE" && (
                            <FormField
                                control={form.control}
                                name="response_policy.template.body"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 w-full md:col-span-2">
                                        <Label>
                                            {translate(
                                                "resources.callbridge.mapping.fields.delivery_policy.response_policy.template"
                                            ) + " (response_body)"}
                                        </Label>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ""}
                                                className="h-36 w-full resize-none overflow-auto rounded border border-neutral-60 p-2 text-title-1 text-neutral-80 outline-none focus:border-neutral-60 dark:bg-muted dark:text-white dark:focus:border-neutral-60"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2 md:col-span-3">
                        <Button
                            className="px-6"
                            type="submit"
                            variant="default"
                            disabled={
                                submitButtonDisabled ||
                                (form.getValues("response_policy.type") === "FROM_RESPONSE" &&
                                    (hasErrors ||
                                        (!isValid && form.watch("response_policy.template.headers")?.length !== 0) ||
                                        !monacoEditorMounted))
                            }>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button
                            type="button"
                            variant="outline_gray"
                            className="px-5"
                            onClick={() => onOpenChange(false)}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
