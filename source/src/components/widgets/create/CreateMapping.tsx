import { Button } from "@/components/ui/Button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { CallbackMappingCreate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

interface CreateWalletProps {
    onOpenChange: (state: boolean) => void;
}

export const CreateMapping = (props: CreateWalletProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<CallbackMappingCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.create("callbridge/v1/mapping", { data: data });
            appToast(
                "success",
                translate("resources.callbridge.mapping.createSuccess"),
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("resources.callbridge.mapping.errors.errorWhenCreating"));
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty")),
        external_path: z.string().min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty")),
        internal_path: z
            .string()
            .url(translate("resources.callbridge.mapping.errors.invalidUrl"))
            .optional()
            .or(z.literal("")),
        description: z.optional(z.string()),
        adapter_nats_subject: z.optional(z.string())
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            external_path: "",
            internal_path: "",
            description: "",
            adapter_nats_subject: ""
        }
    });

    usePreventFocus({ dependencies: [] });

    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate("resources.callbridge.mapping.fields.name")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="internal_path"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.callbridge.mapping.fields.int_path")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="external_path"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.callbridge.mapping.fields.ext_path")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="adapter_nats_subject"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.callbridge.mapping.fields.nats_subject")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="md:col-span-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.callbridge.mapping.fields.description")}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                        <Button type="submit" variant="default" className="w-full sm:w-auto">
                            {translate("app.ui.actions.save")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline_gray"
                            type="button"
                            className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};
