import { useEditController, EditContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
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
import { useFetchDataForDirections, useGetTerminals, usePreventFocus } from "@/hooks";
import { Label } from "@/components/ui/label";

export interface DirectionEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionEdit = ({ id, onOpenChange }: DirectionEditProps) => {
    const dataProvider = useDataProvider();
    const { currencies, merchants, providers, isLoading: loadingData } = useFetchDataForDirections();
    const controllerProps = useEditController({ resource: "direction", id, mutationMode: "pessimistic" });

    const { terminals, getTerminals } = useGetTerminals();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.direction.errors.name")).trim(),
        active: z.boolean().default(false),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.direction.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.direction.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.direction.errors.merchant")),
        provider: z.string().min(1, translate("resources.direction.errors.provider")),
        terminal: z.string().min(1, translate("resources.direction.errors.terminal")),
        weight: z.number()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: controllerProps.record?.name || "",
            active: controllerProps.record?.active || true,
            description: controllerProps.record?.description || "",
            src_currency: controllerProps.record?.src_currency.code || "",
            dst_currency: controllerProps.record?.dst_currency.code || "",
            merchant: controllerProps.record?.merchant.id || "",
            provider: controllerProps.record?.provider.name || "",
            terminal: controllerProps.record?.terminal?.terminal_id || "",
            weight: controllerProps.record?.weight || 0
        }
    });

    useEffect(() => {
        if (controllerProps.record) {
            form.reset({
                name: controllerProps.record?.name || "",
                active: controllerProps.record?.active || true,
                description: controllerProps.record?.description || "",
                src_currency: controllerProps.record?.src_currency.code || "",
                dst_currency: controllerProps.record?.dst_currency.code || "",
                merchant: controllerProps.record?.merchant.id || "",
                provider: controllerProps.record?.provider.name || "",
                terminal: controllerProps.record?.terminal?.terminal_id || "",
                weight: controllerProps.record?.weight || 0
            });
        }
    }, [form, controllerProps.record]);

    const onSubmit: SubmitHandler<Directions.DirectionCreate> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            await dataProvider.update("direction", {
                id,
                data,
                previousData: undefined
            });
            refresh();
            onOpenChange(false);
        } catch (error) {
            setSubmitButtonDisabled(false);
        }
    };

    useEffect(() => {
        getTerminals(controllerProps.record.provider.name);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controllerProps.record.provider.name, controllerProps.record.provider]);

    usePreventFocus({ dependencies: [controllerProps.record] });

    const terminalsDisabled = !(terminals && Array.isArray(terminals) && terminals?.length > 0);

    if (controllerProps.isLoading || !controllerProps.record || loadingData)
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.direction.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="src_currency"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.sourceCurrency")}</Label>
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
                                                {currencies?.data.map((currency: Currencies.Currency) => {
                                                    return (
                                                        <SelectItem
                                                            key={currency.code}
                                                            value={currency.code}
                                                            variant={SelectType.GRAY}>
                                                            {currency.code}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.merchant")}</Label>
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
                                                {merchants?.data.map((merchant: Merchant) => {
                                                    return (
                                                        <SelectItem
                                                            key={merchant.name}
                                                            value={merchant.id}
                                                            variant={SelectType.GRAY}>
                                                            {merchant.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dst_currency"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.destinationCurrency")}</Label>
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
                                                {currencies?.data.map((currency: Currencies.Currency) => {
                                                    return (
                                                        <SelectItem
                                                            key={currency.code}
                                                            value={currency.code}
                                                            variant={SelectType.GRAY}>
                                                            {currency.code}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.provider")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={e => {
                                            getTerminals(e);
                                            if (e !== form.getValues().provider) form.setValue("terminal", "");
                                            field.onChange(e);
                                        }}>
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
                                                {providers?.data.map((provider: Provider) => {
                                                    return (
                                                        <SelectItem
                                                            variant={SelectType.GRAY}
                                                            key={provider.name}
                                                            value={provider.name}
                                                            disabled={provider.public_key ? false : true}>
                                                            {provider.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="terminal"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.fields.terminal")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={terminalsDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        terminalsDisabled
                                                            ? translate("resources.direction.noTerminals")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!terminalsDisabled
                                                    ? terminals.map(terminal => (
                                                          <SelectItem
                                                              key={terminal.terminal_id}
                                                              value={terminal.terminal_id}
                                                              variant={SelectType.GRAY}>
                                                              {terminal.verbose_name}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <Label>{translate("resources.direction.fields.active")}</Label>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.active")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="true" variant={SelectType.GRAY}>
                                                    {translate("resources.direction.fields.stateActive")}
                                                </SelectItem>
                                                <SelectItem value="false" variant={SelectType.GRAY}>
                                                    {translate("resources.direction.fields.stateInactive")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.direction.weight")}
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
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.direction.description")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="w-full mt-4 md:mt-0 md:w-2/5 p-2 ml-auto flex flex-col gap-3 sm:gap-0 sm:flex-row space-x-0 sm:space-x-2">
                            <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1"
                                onClick={() => {
                                    onOpenChange(false);
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
