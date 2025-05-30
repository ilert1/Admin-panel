import { DirectionType, SystemPaymentInstrumentStatus } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
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

    const directions = Object.keys(DirectionType);
    const statuses = Object.keys(SystemPaymentInstrumentStatus);

    const { data: record, isLoading: isLoadingPaymentInstrument } = useQuery({
        queryKey: ["paymentInstrument", id],
        queryFn: () => dataProvider.getOne("systemPaymentInstruments", { id }),
        select: data => data.data
    });

    const formSchema = z.object({
        name: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty"))
            .regex(/^[A-Za-z0-9 _-]+$/, translate("resources.paymentTools.systemPaymentInstruments.errors.nameRegex"))
            .trim(),
        direction: z.enum(directions as [string, ...string[]]).default("universal"),
        status: z.enum(statuses as [string, ...string[]]).default("active"),
        description: z.string().optional(),
        meta: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            direction: DirectionType.universal,
            status: SystemPaymentInstrumentStatus.active,
            description: "",
            meta: "{}"
        }
    });

    useEffect(() => {
        if (!isLoadingPaymentInstrument) {
            form.reset({
                name: record.name,
                direction: record.direction,
                status: record.status,
                description: record.description,
                meta: JSON.stringify(record.meta)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingPaymentInstrument, record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        data.meta = JSON.parse(data.meta);
        try {
            await dataProvider.update("systemPaymentInstruments", {
                id,
                data,
                previousData: undefined
            });
            appToast("success", translate("app.ui.toast.success"));
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
                            name="name"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate(
                                                    "resources.paymentTools.systemPaymentInstruments.fields.name"
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
                            name="direction"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.direction")}
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
                                                {directions.map(direction => (
                                                    <SelectItem
                                                        key={direction}
                                                        value={direction}
                                                        variant={SelectType.GRAY}>
                                                        {direction}
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
                            name="status"
                            render={({ field, fieldState }) => (
                                <FormItem className="">
                                    <Label>
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.status")}
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
                                                {statuses.map(status => (
                                                    <SelectItem key={status} value={status} variant={SelectType.GRAY}>
                                                        {translate(
                                                            `resources.paymentTools.systemPaymentInstruments.statuses.${status}`
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
                            name="description"
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                label={translate(
                                                    "resources.paymentTools.systemPaymentInstruments.fields.description"
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
                                <FormItem className="col-span-1 p-2 sm:col-span-2">
                                    <Label className="!mb-0">
                                        {translate("resources.paymentTools.systemPaymentInstruments.fields.meta")}
                                    </Label>
                                    <FormControl>
                                        <MonacoEditor
                                            width="100%"
                                            onMountEditor={() => setMonacoEditorMounted(true)}
                                            onErrorsChange={setHasErrors}
                                            code={field.value ?? "{}"}
                                            setCode={field.onChange}
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
                            disabled={hasErrors || !monacoEditorMounted || buttonDisabled}>
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
