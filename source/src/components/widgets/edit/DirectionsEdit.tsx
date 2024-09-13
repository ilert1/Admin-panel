import { useEditController, EditContextProvider, useRedirect, useTranslate, useDataProvider } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useFetchDataForDirections } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";

export const DirectionEdit = () => {
    const dataProvider = useDataProvider();
    const { currencies, merchants, providers, isLoading: loadingData } = useFetchDataForDirections();

    const controllerProps = useEditController();
    controllerProps.mutationMode = "pessimistic";

    const { record, isLoading } = useEditController();
    const { toast } = useToast();
    const { id } = useParams();
    const translate = useTranslate();
    const redirect = useRedirect();

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
    }, [record]);

    const onSubmit: SubmitHandler<DirectionCreate> = async data => {
        try {
            await dataProvider.update("merchant", {
                id,
                data,
                previousData: undefined
            });
            redirect("list", "merchant");
        } catch (error: any) {}
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.directions.errors.name")).trim(),
        active: z.boolean().default(false),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.directions.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.directions.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.directions.errors.merchant")),
        provider: z.string().min(1, translate("resources.directions.errors.provider")),
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

    if (isLoading || !record || loadingData) return <Loading />;

    return (
        <EditContextProvider value={controllerProps}>
            <p className="mb-2">{translate("resources.directions.note")}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.fields.active")}</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"} // Преобразуем булево значение в строку
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("resources.directions.fields.active")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="true">
                                                    {translate("resources.directions.fields.stateActive")}
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    {translate("resources.directions.fields.stateInactive")}
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
                            name="src_currency"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.sourceCurrency")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {currencies?.data.map((currency: Currencies.Currency) => {
                                                    return (
                                                        <SelectItem key={currency.code} value={currency.code}>
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
                            name="dst_currency"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.destinationCurrency")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {currencies?.data.map((currency: Currencies.Currency) => {
                                                    return (
                                                        <SelectItem key={currency.code} value={currency.code}>
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
                                    <FormLabel>{translate("resources.directions.merchant")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {merchants?.data.map((merchant: Merchant) => {
                                                    return (
                                                        <SelectItem key={merchant.name} value={merchant.id}>
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
                            name="provider"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.provider")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {providers?.data.map((provider: Provider) => {
                                                    return (
                                                        <SelectItem
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.directions.weight")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
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
                                    <FormLabel>{translate("resources.directions.description")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                            <Button
                                type="button"
                                variant="error"
                                className="flex-1"
                                onClick={() => redirect("list", "direction")}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                            <Button type="submit" variant="default" className="flex-1">
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
