import { useCreateController, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { PaymentTypeCreate as IPaymentTypeCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
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
import { CurrencySelect } from "../components/Selects/CurrencySelect";
import { useCurrenciesListWithoutPagination } from "@/hooks";
import { useGetMerchantData } from "@/hooks/useGetMerchantData";
import { useQuery } from "@tanstack/react-query";
import { MerchantsDataProvider } from "@/data";
import { CascadesDataProvider } from "@/data/cascades";

const CASCADE_TYPE = ["deposit", "withdrawal"];
const CASCADE_STATE = ["active", "inactive", "archived"];
const CASCADE_KIND = ["sequential", "fanout"];

interface MerchantCascadeCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const MerchantCascadeCreate = (props: MerchantCascadeCreateProps) => {
    const { onOpenChange } = props;
    const dataProvider = useDataProvider();
    const merchantsDataProvider = new MerchantsDataProvider();
    const cascadesDataProvider = new CascadesDataProvider();
    const controllerProps = useCreateController({ resource: "cascadeSettings/cascadeMerchants" });
    const { theme } = useTheme();
    const appToast = useAppToast();
    const translate = useTranslate();

    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();

    const { data: merchants, isLoading: isLoadingMerchants } = useQuery({
        queryKey: ["merchants_list"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("", signal)
    });

    // const { data: cascades, isLoading: isCascadesLoading } = useQuery({
    //     queryKey: ["cascades_list"],
    //     queryFn: async ({ signal }) =>
    //         await cascadesDataProvider.getList("", { pagination: { page: 1, perPage: 100000 } })
    // });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);

    const formSchema = z.object({
        merchant: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim(),
        cascade: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim(),
        state: z.enum(CASCADE_STATE as [string, ...string[]]).default(CASCADE_STATE[0])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            state: CASCADE_STATE[0]
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await dataProvider.create("cascades", {
                data: {
                    ...data,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {}
                }
            });

            appToast("success", translate("app.ui.create.createSuccess"));
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already exists")) {
                    appToast("error", translate("resources.cascadeSettings.cascades.errors.alreadyExist"));
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

    if (controllerProps.isLoading || isCurrenciesLoading || theme.length === 0)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascades.fields.name")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.cascadeSettings.cascades.fields.type")}</Label>
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
                                                {CASCADE_TYPE.map(type => (
                                                    <SelectItem value={type} variant={SelectType.GRAY} key={type}>
                                                        {translate(`resources.cascadeSettings.cascades.types.${type}`)}
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
                            name="rank"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascades.fields.rank")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="src_currency_code"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>
                                        {translate("resources.cascadeSettings.cascades.fields.src_currency_code")}
                                    </Label>
                                    <CurrencySelect
                                        currencies={currenciesData || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={currenciesLoadingProcess}
                                        modal
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cascade_kind"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.cascadeSettings.cascades.fields.cascade_kind")}</Label>
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
                                                {CASCADE_KIND.map(kind => (
                                                    <SelectItem value={kind} variant={SelectType.GRAY} key={kind}>
                                                        {translate(`resources.cascadeSettings.cascades.kinds.${kind}`)}
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
                            name="state"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.cascadeSettings.cascades.fields.state")}</Label>
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
                                                {CASCADE_STATE.map(state => (
                                                    <SelectItem value={state} variant={SelectType.GRAY} key={state}>
                                                        {translate(`resources.cascadeSettings.cascades.state.${state}`)}
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
                            render={({ field, fieldState }) => (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("resources.cascadeSettings.cascades.fields.description")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-1 sm:col-span-2">
                                        <Label>{translate("resources.cascadeSettings.cascades.fields.details")}</Label>
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
                    </div>

                    <div className="ml-auto mt-4 flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:mt-0 md:w-2/5">
                        <Button
                            type="submit"
                            variant="default"
                            className="flex-1"
                            disabled={
                                submitButtonDisabled ||
                                hasErrors ||
                                (!isValid && form.watch("details")?.length !== 0) ||
                                !monacoEditorMounted
                            }>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button type="button" variant="outline_gray" className="flex-1" onClick={onClose}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
