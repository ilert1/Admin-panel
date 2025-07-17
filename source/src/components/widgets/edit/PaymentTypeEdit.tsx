import { useTranslate, useEditController, EditContextProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useCurrenciesListWithoutPagination, usePreventFocus } from "@/hooks";
import { useRefresh } from "react-admin";
import {
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
    Select,
    SelectType,
    SelectItem
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentCategory } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { CurrenciesMultiSelect } from "../components/MultiSelectComponents/CurrenciesMultiSelect";
import { PaymentTypesProvider } from "@/data/payment_types";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

export interface PaymentTypeEditProps {
    id: string;
    onClose?: () => void;
}

export const PaymentTypeEdit = ({ id, onClose = () => {} }: PaymentTypeEditProps) => {
    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const paymentTypesDataProvider = new PaymentTypesProvider();
    const controllerProps = useEditController({ resource: "payment_type", id });
    const { theme } = useTheme();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const translate = useTranslate();
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const paymentTypeCategories = Object.keys(PaymentCategory);

    const formSchema = z.object({
        code: z.string().min(1, translate("resources.paymentSettings.paymentType.errors.code")).trim(),
        title: z
            .string()
            .min(1, translate("resources.paymentSettings.systemPaymentInstruments.errors.cantBeEmpty"))
            .default(""),
        category: z.enum(paymentTypeCategories as [string, ...string[]]),
        required_fields_for_payment: z.string().optional(),
        meta: z.string().trim().optional(),
        currencies: z.array(z.string()).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: id,
            title: controllerProps.record?.title ?? "",
            category: controllerProps.record?.category ?? "",
            required_fields_for_payment: controllerProps.record?.required_fields_for_payment?.join(", ") ?? "",
            meta: JSON.stringify(controllerProps.record?.meta, null, 2) || "{}",
            currencies: controllerProps.record?.currencies?.map((c: { code: string }) => c.code) ?? []
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        const required_fields_for_payment = data.required_fields_for_payment?.trim()
            ? data.required_fields_for_payment?.split(",").map(item => item.trim())
            : [];

        let currencies: string[] = [];
        let oldCurrencies: Set<string> = new Set();

        if (controllerProps.record?.currencies) {
            oldCurrencies = new Set(controllerProps.record?.currencies?.map((c: { code: string }) => c.code));
        }

        if (data.currencies) {
            currencies = [...data.currencies];
            delete data.currencies;
        }

        const currenciesToDelete = oldCurrencies.difference(new Set(currencies));

        try {
            required_fields_for_payment.forEach(item => {
                if (!item.match(/^[a-z0-9_]+$/)) {
                    throw new Error("paymentFieldsRegex");
                }
            });

            await paymentTypesDataProvider.update("payment_type", {
                id,
                data: { ...data, required_fields_for_payment },
                previousData: undefined
            });

            if (currenciesToDelete.size > 0) {
                await Promise.all(
                    Array.from(currenciesToDelete).map(currency =>
                        paymentTypesDataProvider.deleteCurrency({
                            id,
                            code: currency,
                            previousData: undefined,
                            data: {}
                        })
                    )
                );
            }

            if (currencies.length > 0) {
                await paymentTypesDataProvider.addCurrencies({
                    id,
                    data: {
                        codes: currencies
                    },
                    previousData: undefined
                });
            }

            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already exists")) {
                    appToast("error", translate("resources.paymentSettings.paymentType.duplicateCode"));
                } else if (error.message.includes("paymentFieldsRegex")) {
                    appToast("error", translate("resources.paymentSettings.paymentType.errors.paymentFieldsRegex"));
                } else {
                    appToast("error", error.message);
                }
            } else {
                appToast("error", translate("app.ui.toast.error"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({});

    if (controllerProps.isLoading || theme.length === 0 || isCurrenciesLoading)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.paymentSettings.paymentType.fields.code")}
                                                disabled
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.paymentSettings.paymentType.fields.title")}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>
                                            {translate("resources.paymentSettings.paymentType.fields.category")}
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
                                                    {paymentTypeCategories.map(category => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                            variant={SelectType.GRAY}>
                                                            {category}
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
                                name="required_fields_for_payment"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentSettings.paymentType.fields.required_fields_for_payment"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currencies"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <CurrenciesMultiSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={currenciesData || []}
                                                isLoading={currenciesLoadingProcess}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="meta"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="col-span-1 w-full p-2 sm:col-span-2">
                                            <Label>
                                                {translate(
                                                    "resources.paymentSettings.systemPaymentInstruments.fields.meta"
                                                )}
                                            </Label>
                                            <FormControl>
                                                <MonacoEditor
                                                    onErrorsChange={setHasErrors}
                                                    onValidChange={setIsValid}
                                                    onMountEditor={() => setMonacoEditorMounted(true)}
                                                    code={field.value ?? "{}"}
                                                    setCode={field.onChange}
                                                    allowEmptyValues
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* <FormField
                                control={form.control}
                                name="meta.icon"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>{translate("resources.paymentSettings.paymentType.fields.icon")}</Label>
                                        <div className="!mt-0 flex items-center gap-4">
                                            {field.value && (
                                                <div className="h-10 w-10">
                                                    <img
                                                        src={field.value}
                                                        alt="icon"
                                                        className="pointer-events-none h-full w-full object-contain"
                                                    />
                                                </div>
                                            )}

                                            <div className="relative w-full">
                                                <label
                                                    htmlFor="icon-upload"
                                                    className="block w-full cursor-pointer rounded-4 bg-green-50 px-4 py-2 text-center !text-white transition-all duration-300 hover:bg-green-40"
                                                    title={
                                                        iconFileName ||
                                                        translate("resources.paymentSettings.paymentType.uploadIcon") +
                                                            "..."
                                                    }>
                                                    <span className="block truncate">
                                                        {iconFileName ||
                                                            translate("resources.paymentSettings.paymentType.uploadIcon") +
                                                                "..."}
                                                    </span>
                                                </label>

                                                {iconFileName && (
                                                    <X
                                                        size={20}
                                                        className="absolute right-2 top-2 cursor-pointer text-white"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setIconFileName("");
                                                            form.setValue("meta.icon", "", { shouldValidate: true });

                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = "";
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                id="icon-upload"
                                                type="file"
                                                accept=".svg"
                                                style={{ display: "none" }}
                                                onChange={async e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setIconFileName(file.name);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string;
                                                            form.setValue("meta.icon", base64, {
                                                                shouldValidate: true
                                                            });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = "";
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            /> */}
                        </div>
                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={
                                    submitButtonDisabled ||
                                    hasErrors ||
                                    (!isValid && form.watch("meta")?.length !== 0) ||
                                    !monacoEditorMounted
                                }>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                onClick={onClose}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
