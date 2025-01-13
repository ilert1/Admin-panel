import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { Button } from "@/components/ui/button";
import { useLocaleState, useTranslate } from "react-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { LoadingBlock } from "@/components/ui/loading";

interface IProps {
    currencies: Dictionaries.Currency[] | undefined;
    payMethods: PayOut.PayMethod[] | undefined;
    loading: boolean;
    create: (data: { payMethod: PayOut.PayMethod; [key: string]: string | PayOut.PayMethod }) => Promise<boolean>;
}

const CustomFieldTypes = new Map<PayOut.PaymentType, string[]>([
    ["sbp", ["phone_number", "card_holder"]],
    ["card2card", ["card_number", "card_holder"]],
    ["account_number", ["account_number"]],
    ["account_number_iban", ["iban_number", "account_name"]],
    ["sberpay", ["phone_number", "card_holder"]]
]);

export const PayOutForm = ({ currencies, payMethods, loading, create }: IProps) => {
    const translate = useTranslate();
    const [payMethodId, setPayMethodId] = useState<string | null>(null);
    const [locale] = useLocaleState();

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
        return payMethod?.paymentType ? CustomFieldTypes.get(payMethod.paymentType) : [];
    }, [payMethod]);

    const finalFormSchema = useMemo(() => {
        let schema = formSchema;

        additionalFields?.forEach(field => {
            schema = schema.extend({
                [field]: z.string().min(1, translate("app.widgets.forms.payout.valueMessage"))
            });
        });

        return schema;
    }, [additionalFields, formSchema, translate]);

    const form = useForm<z.infer<typeof finalFormSchema>>({
        resolver: zodResolver(finalFormSchema),
        defaultValues: { ...finalFormSchema }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (payMethod) {
            const completeCreate = await create({ ...values, payMethod });

            if (completeCreate) {
                form.reset(Object.fromEntries(Object.keys(values).map(key => [key, ""])));
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex-1">
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="payMethod"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payout.payMethod")}</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={e => {
                                            form.setValue("payMethod", e);
                                            field.onChange(e);
                                            setPayMethodId(e);
                                        }}
                                        value={field.value}>
                                        <FormControl>
                                            <SelectTrigger
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted/50 ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}>
                                                <div className="mr-auto">
                                                    <SelectValue
                                                        placeholder={translate(
                                                            "app.widgets.forms.payout.selectPayMethod"
                                                        )}
                                                    />
                                                </div>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger className="ml-3 order-3" asChild>
                                                                <TriangleAlert
                                                                    className="text-red-40"
                                                                    width={14}
                                                                    height={14}
                                                                />
                                                            </TooltipTrigger>

                                                            <TooltipContent
                                                                className="border-none bottom-0"
                                                                side="left">
                                                                <FormMessage />
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {loading ? (
                                                <div className="flex items-center justify-center p-4">
                                                    <LoadingBlock />
                                                </div>
                                            ) : (
                                                <>
                                                    {payMethodsWithId &&
                                                        payMethodsWithId?.map(method => (
                                                            <SelectItem key={method.id} value={method.id}>
                                                                {`${method.bankName} (${method.paymentTypeName}, ${method.fiatCurrency})`}
                                                            </SelectItem>
                                                        ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-1">
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="value"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted/50 ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate("app.widgets.forms.payout.value", {
                                                currency: currency || ""
                                            })}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    {additionalFields?.map((item, i: number) => (
                        <FormField
                            disabled={loading}
                            key={i}
                            control={form.control}
                            name={item}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted/50 ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            label={translate(`app.widgets.forms.payout.${item}`)}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button disabled={loading} type="submit">
                        {translate("app.widgets.forms.payout.createOrder")}
                    </Button>

                    <NavLink to={"/"}>
                        <Button disabled={loading} variant="outline_sec">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </NavLink>
                </div>
            </form>
        </Form>
    );
};
