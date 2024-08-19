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

enum PositionEnum {
    BEFORE = "before",
    AFTER = "after"
}

export const CurrencyEdit = () => {
    const dataProvider = useDataProvider();
    const controllerProps = useEditController();
    controllerProps.mutationMode = "pessimistic";

    const { record, isLoading } = useEditController();

    const { id } = useParams();

    const translate = useTranslate();
    const redirect = useRedirect();

    useEffect(() => {
        if (record) {
            form.reset({
                code: record?.code || "",
                position: record?.position || PositionEnum.BEFORE,
                symbol: record?.symbol || "",
                is_coin: record?.is_coin || false
            });
        }
    }, [record]);

    const onSubmit: SubmitHandler<Omit<Currencies.Currency, "id">> = async data => {
        console.log(data);
        await dataProvider.update("currency", {
            id: id,
            data: data,
            previousData: undefined
        });
        redirect("list", "currency");
    };

    const formSchema = z.object({
        code: z.string().min(1, translate("resources.currencies.errors.code")),
        position: z.enum([PositionEnum.AFTER, PositionEnum.BEFORE]),
        symbol: z.string().nullable(),
        is_coin: z.boolean().default(false)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: record?.code || "",
            position: record?.position || PositionEnum.BEFORE,
            symbol: record?.symbol || "",
            is_coin: record?.is_coin || false
        }
    });
    if (isLoading || !record) return <Loading />;

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.currencies.fields.currencyName")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_coin"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.currencies.fields.type")}</FormLabel>
                                    <Select
                                        onValueChange={value => field.onChange(value === "true")}
                                        value={field.value ? "true" : "false"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("resources.currencies.fields.type")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="false">
                                                    {translate("resources.currencies.fields.fiat")}
                                                </SelectItem>
                                                <SelectItem value="true">
                                                    {translate("resources.currencies.fields.crypto")}
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
                            name="symbol"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.currencies.fields.symbol")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.currencies.fields.symbPos")}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={value => field.onChange(value as PositionEnum)}
                                            value={field.value}>
                                            <SelectTrigger className="">
                                                <SelectValue
                                                    placeholder={translate("resources.currencies.fields.symbPos")}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value={PositionEnum.BEFORE}>
                                                        {translate("resources.currencies.fields.before")}
                                                    </SelectItem>
                                                    <SelectItem value={PositionEnum.AFTER}>
                                                        {translate("resources.currencies.fields.after")}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="w-1/5 p-2 ml-auto">
                            <Button type="submit" variant="default" className="w-full">
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
