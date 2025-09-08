import { useTranslate, useDataProvider, useRefresh, useEditController, EditContextProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { usePreventFocus } from "@/hooks";
import { Loading } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { CurrencyWithId } from "@/data/currencies";
import { CurrencyPosition } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export const CurrencyEdit = ({ id, closeDialog }: { id: string; closeDialog: () => void }) => {
    const dataProvider = useDataProvider();

    const controllerProps = useEditController<CurrencyWithId>({
        resource: "paymentSettings/currency",
        id,
        mutationMode: "pessimistic"
    });

    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        code: z.string().min(1, translate("resources.currency.errors.code")),
        position: z.enum([CurrencyPosition.after, CurrencyPosition.before]),
        symbol: z.string().trim().nullable(),
        is_coin: z.boolean().default(false),
        accuracy: z
            .union([
                z.coerce
                    .number({ message: translate("resources.currency.errors.intOnly") })
                    .int(translate("resources.currency.errors.intOnly"))
                    .min(1, translate("resources.currency.errors.minVal"))
                    .max(16, translate("resources.currency.errors.maxVal")),
                z.literal(""),
                z.null()
            ])
            .optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: controllerProps.record?.code || "",
            position: controllerProps.record?.position || CurrencyPosition.before,
            symbol: controllerProps.record?.symbol || "",
            is_coin: controllerProps.record?.is_coin || false,
            accuracy: controllerProps.record?.accuracy || 2
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                code: controllerProps.record?.code || "",
                position: controllerProps.record?.position || CurrencyPosition.before,
                symbol: controllerProps.record?.symbol || "",
                is_coin: controllerProps.record?.is_coin || false,
                accuracy: controllerProps.record?.accuracy || 2
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        if (!data.accuracy) {
            delete data.accuracy;
        }

        try {
            await dataProvider.update("paymentSettings/currency", {
                id,
                data: data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();
            closeDialog();
        } catch (error) {
            if (error instanceof Error)
                appToast(
                    "error",
                    error.message.includes("already exists")
                        ? translate("resources.currency.errors.alreadyInUse")
                        : error.message
                );
            else appToast("error", translate("app.ui.toast.error"));
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({ dependencies: [controllerProps.record] });

    if (controllerProps.isLoading || !controllerProps.record) return <Loading />;

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoFocus={false}>
                    <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 md:grid-rows-2 md:items-end">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            label={translate("resources.currency.fields.currencyName")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="symbol"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.currency.fields.symbol")}
                                            variant={InputTypes.GRAY}
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_coin"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <Label>{translate("resources.currency.fields.type")}</Label>
                                    <Select
                                        onValueChange={value => field.onChange(value === "true")}
                                        value={field.value ? "true" : "false"}>
                                        <FormControl>
                                            <SelectTrigger
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={translate("resources.currency.fields.type")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="false" variant={SelectType.GRAY}>
                                                    {translate("resources.currency.fields.fiat")}
                                                </SelectItem>
                                                <SelectItem value="true" variant={SelectType.GRAY}>
                                                    {translate("resources.currency.fields.crypto")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <Label>{translate("resources.currency.fields.symbPos")}</Label>
                                    <FormControl>
                                        <Select
                                            onValueChange={value => field.onChange(value as CurrencyPosition)}
                                            value={field.value}>
                                            <SelectTrigger
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={translate("resources.currency.fields.symbPos")}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem
                                                        value={CurrencyPosition.before}
                                                        variant={SelectType.GRAY}>
                                                        {translate("resources.currency.fields.before")}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={CurrencyPosition.after}
                                                        variant={SelectType.GRAY}>
                                                        {translate("resources.currency.fields.after")}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="accuracy"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            className="text-sm"
                                            placeholder={translate(
                                                "resources.currency.fields.defaultAccuracyPlaceholder"
                                            )}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.currency.fields.accuracy")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            inputMode="numeric"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                        <Button type="submit" variant="default" disabled={submitButtonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button type="button" onClick={() => closeDialog()} variant="outline_gray">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
