import { Button } from "@/components/ui/Button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

import { useAppToast } from "@/components/ui/toast/useAppToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface SystemPaymentInstrumentEditProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const SystemPaymentInstrumentEdit = (props: SystemPaymentInstrumentEditProps) => {
    const { id, onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);

    const { data: record, isLoading: isLoadingPaymentInstrument } = useQuery({
        queryKey: ["paymentInstrument", id],
        queryFn: ({ signal }) => dataProvider.getOne("systemPaymentInstruments", { id, signal }),
        select: data => data.data
    });

    const formSchema = z.object({
        description: z.string().optional(),
        meta: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            meta: "{}"
        }
    });

    useEffect(() => {
        if (!isLoadingPaymentInstrument) {
            form.reset({
                description: record.description || "",
                meta: JSON.stringify(record.meta, null, 2) || "{}"
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingPaymentInstrument, record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.update("systemPaymentInstruments", {
                id,
                data: { ...data, meta: data.meta && data.meta.length !== 0 ? JSON.parse(data.meta) : {} },
                previousData: undefined
            });
            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else appToast("error", translate("app.ui.toast.error"));
        } finally {
            setButtonDisabled(false);
            onOpenChange(false);
        }
    };

    if (isLoadingPaymentInstrument)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="flex flex-col flex-wrap gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate(
                                                    "resources.paymentSettings.systemPaymentInstruments.fields.description"
                                                )}
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
                            name="meta"
                            render={({ field }) => (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <Label className="!mb-0">
                                        {translate("resources.paymentSettings.systemPaymentInstruments.fields.meta")}
                                    </Label>
                                    <FormControl>
                                        <MonacoEditor
                                            width="100%"
                                            onMountEditor={() => setMonacoEditorMounted(true)}
                                            onErrorsChange={setHasErrors}
                                            onValidChange={setHasValid}
                                            code={field.value ?? "{}"}
                                            setCode={field.onChange}
                                            allowEmptyValues
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full sm:w-auto"
                            disabled={
                                hasErrors ||
                                (!hasValid && form.watch("meta")?.length !== 0) ||
                                !monacoEditorMounted ||
                                buttonDisabled
                            }>
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
                </div>
            </form>
        </FormProvider>
    );
};
