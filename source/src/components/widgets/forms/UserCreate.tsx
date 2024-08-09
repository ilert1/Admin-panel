import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate, useLocaleState } from "react-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

export const UserCreateForm = (props: {
    accounts: any[];
    currencies: any[];
    loading: boolean;
    create: (data: {
        name: string;
        login: string;
        email: string;
        password: string;
        publicKey: string;
        shopCurrency: string;
        shopApiKey: string,
        shopSignKey: string,
        shopBalanceKey: string,
    }) => void;
}) => {
    const translate = useTranslate();
    const [locale] = useLocaleState();


    const formSchema = z.object({
        source: z.string().min(1, translate("app.widgets.forms.payin.sourceMessage")),
        sourceValue: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("resources.transactions.storno.sourceValueMessage")),
        sourceCurrency: z.string().min(1, translate("app.widgets.forms.payin.sourceCurrencyMessage")),
        dest: z.string().min(1, translate("app.widgets.forms.payin.destinationMessage")),
        destValue: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("resources.transactions.storno.destValueMessage")),
        destCurrency: z.string().min(1, translate("app.widgets.forms.payin.destinationCurrencyMessage"))
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

    

    // function onSubmit(values: z.infer<typeof formSchema>) {
    //     props?.create?.(values);
    // }

    return (
        <Form {...form}>
            <form 
            // onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.source")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={props.loading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={translate("app.widgets.forms.payin.selectSource")}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    {/* <SelectContent>
                                        {sourceAccounts &&
                                            sourceAccounts.map((acc: any) => (
                                                <SelectItem key={acc.id} value={acc.id}>
                                                    {acc.meta.caption}
                                                </SelectItem>
                                            ))}
                                    </SelectContent> */}
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="sourceValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.sourceValue")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="sourceCurrency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.sourceCurrency")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={props.loading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={translate("app.widgets.forms.payin.selectSourceCurrency")}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    {/* <SelectContent>
                                        {sortedCurrencies &&
                                            sortedCurrencies.map((cur: any) => (
                                                <SelectItem key={cur.code} value={cur["alpha-3"]}>
                                                    {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                                </SelectItem>
                                            ))}
                                    </SelectContent> */}
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="dest"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.destination")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={props.loading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={translate("app.widgets.forms.payin.selectDestination")}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    {/* <SelectContent>
                                        {destinationAccounts &&
                                            destinationAccounts.map((acc: any) => (
                                                <SelectItem key={acc.id} value={acc.id}>
                                                    {acc.meta.caption}
                                                </SelectItem>
                                            ))}
                                    </SelectContent> */}
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="destValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.destValue")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={props.loading}
                        control={form.control}
                        name="destCurrency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.payin.destinationCurrency")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={props.loading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={translate(
                                                    "app.widgets.forms.payin.selectDestinationCurrency"
                                                )}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    {/* <SelectContent>
                                        {sortedCurrencies &&
                                            sortedCurrencies.map((cur: any) => (
                                                <SelectItem key={cur.code} value={cur["alpha-3"]}>
                                                    {`${cur["name-" + locale]} (${cur["alpha-3"]})`}
                                                </SelectItem>
                                            ))}
                                    </SelectContent> */}
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={props.loading} type="submit">
                    {translate("app.widgets.forms.payin.createOrder")}
                </Button>
            </form>
        </Form>
    );
};
