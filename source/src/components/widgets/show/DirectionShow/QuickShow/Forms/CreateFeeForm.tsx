import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchDataForDirections } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export enum TypeVariants {}

export const CreateFeeForm = () => {
    const translate = useTranslate();
    const data = fetchDictionaries();
    let typeVariants = Object.entries(data.feeTypes);
    typeVariants = typeVariants.map(elem => elem[1].type_descr);
    const { currencies, isLoading: loadingData } = useFetchDataForDirections();

    const formSchema = z.object({
        id: z.string().min(1, translate("resources.currency.errors.code")),
        type: z.custom(elem => {
            typeVariants.includes(elem);
        }),
        currency: z.boolean().default(false),
        value: z.number().int().gte(1).lte(99)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            type: PositionEnum.BEFORE,
            symbol: "",
            is_coin: false
        }
    });

    const onSubmit: SubmitHandler<DirectionCreate> = async data => {
        data;
        // try {
        //     await dataProvider.create("direction", { data });
        //     redirect("list", "direction");
        // } catch (error) {
        //     toast({
        //         description: translate("resources.provider.errors.alreadyInUse"),
        //         variant: "destructive",
        //         title: "Error"
        //     });
        // }
    };

    return (
        <>
            <p className="mb-2">{translate("resources.direction.note")}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.direction.fields.active")}</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={value => field.onChange(value === "true")}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.active")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="true">
                                                    {translate("resources.direction.fields.stateActive")}
                                                </SelectItem>
                                                <SelectItem value="false">
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
                                            <SelectTrigger>
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
                                                          <SelectItem key={currency.code} value={currency.code}>
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
                                            <SelectTrigger>
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
                                                          <SelectItem key={currency.code} value={currency.code}>
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
                                            <SelectTrigger>
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
                                                          <SelectItem key={merchant.name} value={merchant.id}>
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
                                            <SelectTrigger>
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
                                                              disabled={provider.public_key ? false : true}>
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
                                    <FormLabel>{translate("resources.direction.description")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="p-2 ml-auto w-1/2 md:w-1/4">
                            <Button type="submit" variant="default" className="w-full">
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div> */}
                    </div>
                </form>
            </Form>
        </>
    );
};
