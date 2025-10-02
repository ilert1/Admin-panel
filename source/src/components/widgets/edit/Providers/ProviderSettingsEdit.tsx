import { useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { usePreventFocus } from "@/hooks";
import { ProvidersDataProvider, ProviderUpdateParams } from "@/data/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { ProviderEnvironment } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";

export interface ProviderSettingsEditProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderSettingsEdit = ({ id, onOpenChange = () => {} }: ProviderSettingsEditProps) => {
    const providersDataProvider = new ProvidersDataProvider();
    const refresh = useRefresh();

    const {
        data: provider,
        isLoading: isLoadingProvider,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["provider", id],
        queryFn: ({ signal }) => providersDataProvider.getOne("provider", { id, signal }),
        enabled: true,
        select: data => data.data
    });

    const translate = useTranslate();
    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const getEnvironmentOptions = () => {
        return [...Object.values(ProviderEnvironment)];
    };

    const urlSchema = z
        .string()
        .trim()
        .refine(value => value === "" || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(value), {
            message: translate("resources.provider.settings.errors.WrongFormatOfUrl")
        });

    const formSchema = z.object({
        telegram_chat: urlSchema,
        wiki_link: urlSchema,
        provider_docs: urlSchema,
        temporal_link: urlSchema,
        grafana_link: urlSchema,
        provider_environment: z.nativeEnum(ProviderEnvironment).nullable(),
        mapping_bank_keys: z.object({
            deposit: z.string().trim(),
            withdraw: z.string().trim()
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            telegram_chat: "",
            wiki_link: "",
            provider_docs: "",
            temporal_link: "",
            grafana_link: "",
            provider_environment: null,
            mapping_bank_keys: {
                deposit: "",
                withdraw: ""
            }
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                telegram_chat: provider?.info?.telegram_chat || "",
                wiki_link: provider?.info?.wiki_link || "",
                provider_docs: provider?.info?.provider_docs || "",
                temporal_link: provider?.info?.temporal_link || "",
                grafana_link: provider?.info?.grafana_link || "",
                provider_environment: provider?.info?.provider_environment
                    ? provider?.info?.provider_environment
                    : null,
                mapping_bank_keys: {
                    deposit: provider?.info?.mapping_bank_keys?.deposit || "",
                    withdraw: provider?.info?.mapping_bank_keys?.withdraw || ""
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
                    info: {
                        ...data,
                        provider_environment:
                            data.provider_environment === null
                                ? undefined
                                : (data.provider_environment as ProviderEnvironment)
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

    usePreventFocus({ dependencies: [provider] });

    if (isLoadingProvider || !provider || !isFinished)
        return (
            <div className="h-[400px]">
                <Loading />
            </div>
        );
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col gap-2">
                    <FormField
                        control={form.control}
                        name="telegram_chat"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.telegram_chat")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="wiki_link"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.wiki_link")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="provider_docs"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.provider_docs")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="temporal_link"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.temporal_link")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="grafana_link"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.grafana_link")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="mt-4 w-full border-t-[1px] border-neutral-40 pt-3 dark:border-neutral-100" />

                    <FormField
                        control={form.control}
                        name="mapping_bank_keys.deposit"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.mapping_bank_keys_deposit")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mapping_bank_keys.withdraw"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.settings.mapping_bank_keys_withdraw")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="provider_environment"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.provider.settings.provider_environment")}</Label>
                                <Select
                                    value={field.value ?? ""}
                                    onValueChange={val => field.onChange(val === "__NULL__" ? null : val)}>
                                    <FormControl>
                                        <SelectTrigger
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue
                                                placeholder={
                                                    field.value
                                                        ? translate(
                                                              "resources.provider.settings.provider_environment_placeholder"
                                                          )
                                                        : translate(
                                                              "resources.provider.settings.provider_environments.NULL"
                                                          )
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem variant={SelectType.GRAY} value="__NULL__">
                                                {translate("resources.provider.settings.provider_environments.NULL")}
                                            </SelectItem>
                                            {getEnvironmentOptions().map(env => (
                                                <SelectItem variant={SelectType.GRAY} value={env} key={env}>
                                                    {translate(
                                                        `resources.provider.settings.provider_environments.${env}`
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <div className="mt-5 flex items-center justify-end gap-2 md:col-span-2">
                        <Button className="px-6" type="submit" variant="default" disabled={submitButtonDisabled}>
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
