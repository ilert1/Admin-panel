import { useEditController, EditContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/input";
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
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useFetchDataForDirections } from "@/hooks";

export interface DirectionEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionEdit = (props: DirectionEditProps) => {
    const params = useParams();
    const id = props.id || params.id;

    const dataProvider = useDataProvider();
    const { currencies, merchants, providers, isLoading: loadingData } = useFetchDataForDirections();

    const controllerProps = useEditController({ resource: "direction", id });
    const { record, isLoading } = useEditController({ resource: "direction", id });
    controllerProps.mutationMode = "pessimistic";

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
        weight: z.number()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: record?.name || "",
            active: record?.active || true,
            description: record?.description || "",
            src_currency: record?.src_currency.code || "",
            dst_currency: record?.dst_currency.code || "",
            merchant: record?.merchant.id || "",
            provider: record?.provider.name || "",
            weight: record?.weight || 0
        }
    });

    useEffect(() => {
        if (record) {
            form.reset({
                name: record?.name || "",
                active: record?.active || true,
                description: record?.description || "",
                src_currency: record?.src_currency.code || "",
                dst_currency: record?.dst_currency.code || "",
                merchant: record?.merchant.id || "",
                provider: record?.provider.name || "",
                weight: record?.weight || 0
            });
        }
    }, [form, record]);

    const onSubmit: SubmitHandler<Directions.DirectionCreate> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            await dataProvider.update("direction", {
                id,
                data,
                previousData: undefined
            });
            props.onOpenChange(false);
            refresh();
        } catch (error: any) {
            // Заглушка
            setSubmitButtonDisabled(false);
        }
    };

    if (isLoading || !record || loadingData)
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    return (
        <EditContextProvider value={controllerProps}>
            {/* <p className="mb-2">{translate("resources.direction.note")}</p> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="src_currency"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.sourceCurrency")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.merchant")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dst_currency"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.destinationCurrency")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.provider")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.fields.active")}</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"} // Преобразуем булево значение в строку
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.weight")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.description")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/6 p-2 ml-auto flex space-x-2 pt-5 gap-[12px]">
                            <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="deleteGray"
                                className="flex-1"
                                onClick={() => {
                                    props.onOpenChange(false);
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
