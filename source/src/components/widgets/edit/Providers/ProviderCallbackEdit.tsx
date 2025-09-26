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

export interface IProviderCallbackEdit {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const ProviderCallbackEdit = ({ id, onOpenChange = () => {} }: IProviderCallbackEdit) => {
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

    const formSchema = z.object({
        adapter_nats_subject: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim(),
        callback_nats_queue: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")).trim()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            callback_nats_queue: "",
            adapter_nats_subject: ""
        }
    });

    useEffect(() => {
        if (!isLoadingProvider && provider && isFetchedAfterMount) {
            const updatedValues = {
                callback_nats_queue: provider?.settings?.callback?.callback_nats_queue || "",
                adapter_nats_subject: provider?.settings?.callback?.adapter_nats_subject || ""
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
                            ...provider?.settings?.callback,
                            ...data
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
                        name="adapter_nats_subject"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.fields.adapter_nats_subject")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="callback_nats_queue"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.provider.fields.callback_nats_queue")}
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
