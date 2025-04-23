import { Button } from "@/components/ui/Button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { usePreventFocus } from "@/hooks/usePreventFocus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
    EditContextProvider,
    HttpError,
    useDataProvider,
    useEditController,
    useRefresh,
    useTranslate
} from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Loading } from "@/components/ui/loading";
import { CallbackMappingRead, CallbackMappingCreate } from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";

interface MappingEditProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const MappingEdit = (props: MappingEditProps) => {
    const { id, onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const controllerProps = useEditController<CallbackMappingRead>({
        resource: "callbridge/v1/mapping",
        id
    });

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<CallbackMappingCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.update("callbridge/v1/mapping", { data: data, id, previousData: undefined });
            appToast(
                "success",
                translate("resources.callbridge.mapping.updateSuccess"),
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof HttpError) appToast("error", error.message);
            else appToast("error", translate("resources.callbridge.mapping.errors.errorWhenCreating"));
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty")),
        external_path: z.string().min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty")),
        // .url(translate("resources.callbridge.mapping.errors.invalidUrl")),
        internal_path: z
            .string()
            .min(1, translate("resources.callbridge.mapping.errors.cantBeEmpty"))
            .url(translate("resources.callbridge.mapping.errors.invalidUrl")),
        description: z.optional(z.string())
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: controllerProps.record?.name ?? "",
            external_path: controllerProps.record?.external_path ?? "",
            internal_path: controllerProps.record?.internal_path ?? "",
            description: controllerProps.record?.description ?? ""
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                name: controllerProps.record?.name ?? "",
                external_path: controllerProps.record?.external_path ?? "",
                internal_path: controllerProps.record?.internal_path ?? "",
                description: controllerProps.record?.description ?? ""
            });
        }
    }, [form, controllerProps.record]);

    usePreventFocus({ dependencies: [] });

    if (controllerProps.isLoading || !controllerProps.record) return <Loading />;

    return (
        <>
            <EditContextProvider value={controllerProps}>
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
                                name="external_path"
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
                                name="description"
                                render={({ field, fieldState }) => (
                                    <FormItem>
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
            </EditContextProvider>
        </>
    );
};
