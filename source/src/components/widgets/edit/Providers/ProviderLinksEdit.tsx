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

export interface ProviderLinksEditProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderLinksEdit = ({ id, onOpenChange = () => {} }: ProviderLinksEditProps) => {
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

    const formSchema = z
        .object({
            telegramChat: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
            wikiLink: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
            providerDocs: z.string().trim(),
            temporalLink: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
            grafanaLink: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
            providerEnvironment: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
            mapping_bank_keys: z.object({
                deposit: z.string().trim(),
                withdraw: z.string().trim()
            })
        })
        .transform(data => ({
            mapping_bank_keys: data.mapping_bank_keys,
            telegram_chat: data.telegramChat,
            wiki_link: data.wikiLink,
            provider_docs: data.providerDocs,
            temporal_link: data.temporalLink,
            grafana_link: data.grafanaLink,
            provider_environment: data.providerEnvironment
        }));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            telegram_chat: "",
            wiki_link: "",
            provider_docs: "",
            temporal_link: "",
            grafana_link: "",
            provider_environment: "",
            mapping_bank_keys: {
                deposit: "",
                withdraw: ""
            }
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                telegramChat: provider?.info?.telegram_chat || "",
                wikiLink: provider?.info?.wiki_link || "",
                providerDocs: provider?.info?.provider_docs || "",
                temporalLink: provider?.info?.temporal_link || "",
                grafanaLink: provider?.info?.grafana_link || "",
                providerEnvironment: provider?.info?.provider_environment || "",
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
                    info: data
                },
                previousData: {}
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
                <div className="grid grid-cols-1 gap-x-4 p-2 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="telegramChat"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.links.telegramChat")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="grafanaLink"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.links.grafana_link")}
                                    />
                                </FormControl>
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
