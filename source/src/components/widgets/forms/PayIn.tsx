import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate, useLocaleState } from "react-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventBus, EVENT_PAYIN } from "@/helpers/event-bus";
import { useMemo } from "react";

export const PayInForm = (props: { accounts: any[]; currencies: any[] }) => {
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const { accounts, currencies } = props;

    const sortedCurrencies = useMemo(() => {
        return currencies?.sort((a: any, b: any) => a.prior_gr - b.prior_gr) || [];
    }, [currencies]);

    const formSchema = z.object({
        source: z.string().min(1, translate("app.widgets.forms.payIn.sourceMessage")),
        sourceValue: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("resources.transactions.storno.sourceValueMessage")),
        sourceCurrency: z.string().min(1, translate("app.widgets.forms.payIn.sourceCurrencyMessage")),
        dest: z.string().min(1, translate("app.widgets.forms.payIn.destinationMessage")),
        destValue: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("resources.transactions.storno.destValueMessage")),
        destCurrency: z.string().min(1, translate("app.widgets.forms.payIn.destinationCurrencyMessage"))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            source: "",
            sourceValue: "",
            sourceCurrency: "",
            dest: "",
            destValue: "",
            destCurrency: ""
        }
    });

    const sourceAccounts = useMemo(() => accounts?.filter((elem: any) => elem.type === 2), [accounts]);
    const destinationAccounts = useMemo(() => accounts?.filter((elem: any) => elem.type === 1), [accounts]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        EventBus.getInstance().dispatch(EVENT_PAYIN, values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-row items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="source"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.source")}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("app.widgets.forms.payIn.selectSource")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sourceAccounts &&
                                                sourceAccounts.map((acc: any) => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.meta.caption}
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
                            control={form.control}
                            name="sourceValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.sourceValue")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="sourceCurrency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.sourceCurrency")}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate(
                                                        "app.widgets.forms.payIn.selectSourceCurrency"
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sortedCurrencies &&
                                                sortedCurrencies.map((cur: any) => (
                                                    <SelectItem key={cur.code} value={cur["alpha-3"]}>
                                                        {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="dest"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.destination")}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate("app.widgets.forms.payIn.selectDestination")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {destinationAccounts &&
                                                destinationAccounts.map((acc: any) => (
                                                    <SelectItem key={acc.id} value={acc.id}>
                                                        {acc.meta.caption}
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
                            control={form.control}
                            name="destValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.destValue")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="destCurrency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.payIn.destinationCurrency")}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={translate(
                                                        "app.widgets.forms.payIn.selectDestinationCurrency"
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sortedCurrencies &&
                                                sortedCurrencies.map((cur: any) => (
                                                    <SelectItem key={cur.code} value={cur["alpha-3"]}>
                                                        {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit">{translate("app.widgets.forms.payIn.createOrder")}</Button>
            </form>
        </Form>
    );
};
