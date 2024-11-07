import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useFetchDataForDirections } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const DirectionCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const dataProvider = useDataProvider();
    const { currencies, merchants, providers, isLoading: loadingData } = useFetchDataForDirections();

    const { isLoading } = useCreateController({ resource: "direction" });
    const controllerProps = useCreateController();
    const { toast } = useToast();
    const translate = useTranslate();
    const refresh = useRefresh();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<Directions.DirectionCreate> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            await dataProvider.create("direction", { data });
            refresh();
            onOpenChange(false);
        } catch (error) {
            toast({
                description: translate("resources.provider.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.direction.errors.name")).trim(),
        active: z.boolean().default(false),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.direction.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.direction.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.direction.errors.merchant")),
        provider: z.string().min(1, translate("resources.direction.errors.provider")),
        weight: z.coerce.number()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            active: true,
            description: "",
            src_currency: "",
            dst_currency: "",
            merchant: "",
            provider: "",
            weight: 0
        }
    });

    if (isLoading || loadingData)
        return (
            <div className="h-[140px]">
                <Loading />
            </div>
        );

    const currenciesDisabled = !(currencies && Array.isArray(currencies.data) && currencies?.data?.length > 0);
    const merchantsDisabled = !(merchants && Array.isArray(merchants.data) && merchants?.data?.length > 0);
    const providersDisabled = !(providers && Array.isArray(providers.data) && providers?.data?.length > 0);

    return (
        <CreateContextProvider value={controllerProps}>
            {/* <p className="mb-2">{translate("resources.direction.note")}</p> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} className="bg-muted" variant={InputTypes.GRAY} />
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
                                    <FormLabel>{translate("resources.direction.fields.active")}</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
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
                            name="src_currency"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.sourceCurrency")}</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={currenciesDisabled}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={
                                                        currenciesDisabled
                                                            ? translate("resources.direction.noCurrencies")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!currenciesDisabled
                                                    ? currencies.data.map(currency => (
                                                          <SelectItem
                                                              key={currency.code}
                                                              value={currency.code}
                                                              variant={SelectType.GRAY}>
                                                              {currency.code}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
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
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={currenciesDisabled}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={
                                                        currenciesDisabled
                                                            ? translate("resources.direction.noCurrencies")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!currenciesDisabled
                                                    ? currencies.data.map(currency => (
                                                          <SelectItem
                                                              key={currency.code}
                                                              value={currency.code}
                                                              variant={SelectType.GRAY}>
                                                              {currency.code}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
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
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={merchantsDisabled}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={
                                                        merchantsDisabled
                                                            ? translate("resources.direction.noMerchants")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!merchantsDisabled
                                                    ? merchants.data.map(merchant => (
                                                          <SelectItem
                                                              key={merchant.name}
                                                              value={merchant.id}
                                                              variant={SelectType.GRAY}>
                                                              {merchant.name}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
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
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={providersDisabled}>
                                        <FormControl>
                                            <SelectTrigger variant={SelectType.GRAY}>
                                                <SelectValue
                                                    placeholder={
                                                        providersDisabled
                                                            ? translate("resources.direction.noProviders")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!providersDisabled
                                                    ? providers.data.map(provider => (
                                                          <SelectItem
                                                              key={provider.name}
                                                              value={provider.name}
                                                              disabled={provider.public_key ? false : true}
                                                              variant={SelectType.GRAY}>
                                                              {provider.name}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
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
                                            <Input {...field} value={field.value ?? 0} variant={InputTypes.GRAY} />
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
                        {/* <div className="flex gap-[16px] p-2 ml-auto w-1/3"> */}
                        <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                            <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="deleteGray"
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
        </CreateContextProvider>
    );
};
