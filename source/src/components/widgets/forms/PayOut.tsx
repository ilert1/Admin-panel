import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { Button } from "@/components/ui/button";
import { useLocaleState, useTranslate } from "react-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

export const PayOutForm = (props: {
    currencies: Dictionaries.Currency[] | undefined;
    payMethods: PayOut.PayMethod[] | undefined;
    loading: boolean;
    create: (data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) => void;
}) => {
    const translate = useTranslate();
    const [payMethodId, setPayMethodId] = useState<string | null>(null);
    const [locale] = useLocaleState();
    const { currencies, payMethods } = props;

    const formSchema = z.object<{ [key: string]: ZodTypeAny }>({
        payMethod: z.string().min(1, translate("app.widgets.forms.payout.payMethodMessage")),
        value: z.string().regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("app.widgets.forms.payout.valueMessage"))
    });

    const payMethodsWithId = useMemo(() => {
        return payMethods?.map((method, id: number) => ({ id: "" + id, ...method }));
    }, [payMethods]);

    const payMethod = useMemo(() => payMethodsWithId?.find(m => m.id === payMethodId), [payMethodId, payMethodsWithId]);

    const currency = useMemo(
        () => currencies?.find(c => c["alpha-3"] === payMethod?.fiatCurrency)?.["name-" + locale],
        [currencies, payMethod, locale]
    );

    const additionalFields = useMemo(() => {
        return payMethod?.fields.filter(f => !f.hidden && f.required) || [];
    }, [payMethod]);

    const dynamicFormSchema = useMemo<Record<string, z.ZodType<{ [key: string]: ZodTypeAny }>>>(() => {
        const schema: Record<string, z.ZodType<{ [key: string]: ZodTypeAny }>> = {};

        for (const option of additionalFields) {
            Object.assign(schema, { [option.name]: option.name });
        }

        return schema;
    }, [additionalFields]);

    const finalFormSchema = useMemo(() => {
        let schema = formSchema;

        for (const key of Object.keys(dynamicFormSchema)) {
            schema = schema.extend({
                [key]: z.string().min(1, translate("app.widgets.forms.payout.valueMessage"))
            });
        }

        return schema;
    }, [dynamicFormSchema, formSchema]); //eslint-disable-line react-hooks/exhaustive-deps

    const form = useForm<z.infer<typeof finalFormSchema>>({
        resolver: zodResolver(finalFormSchema),
        defaultValues: {
            payMethod: "",
            value: "",
            ...Object.keys(dynamicFormSchema).reduce((acc: { [key: string]: string }, curr) => {
                acc[curr] = "";
                return acc;
            }, {})
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (payMethod) {
            props.create({ ...values, payMethod });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex-1">
                        <FormField
                            disabled={props.loading}
                            control={form.control}
                            name="payMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payout.payMethod")}</FormLabel>
                                    <Select
                                        disabled={props.loading}
                                        onValueChange={e => {
                                            setPayMethodId(e);
                                            field.onChange(e);
                                        }}
                                        value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("app.widgets.forms.payout.selectPayMethod")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {payMethodsWithId &&
                                                payMethodsWithId?.map(method => (
                                                    <SelectItem key={method.id} value={method.id}>
                                                        {`${method.bankName} (${method.paymentTypeName}, ${method.fiatCurrency})`}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-1">
                        <FormField
                            disabled={props.loading}
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {translate("app.widgets.forms.payout.value", { currency: currency || "" })}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {additionalFields.map((f, i: number) => (
                        <FormField
                            disabled={props.loading}
                            key={i}
                            control={form.control}
                            name={f.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {translate(`app.widgets.forms.payout.${dynamicFormSchema[f.name]}`)}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button disabled={props.loading} type="submit">
                        {translate("app.widgets.forms.payin.createOrder")}
                    </Button>

                    <NavLink to={"/"}>
                        <Button
                            variant="clearBtn"
                            className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </NavLink>
                </div>
            </form>
        </Form>
    );
};
