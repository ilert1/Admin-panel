import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate, useLocaleState } from "react-admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransactionStorno = (props: { accounts: any[]; currencies: any[] }) => {
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const { accounts, currencies } = props;

    const formSchema = z.object({
        source: z.string(),
        destination: z.string(),
        currency: z.string(),
        destValue: z.number({
            message: translate("resources.transactions.storno.destValueMessage")
        }),
        sourceValue: z.number({
            message: translate("resources.transactions.storno.sourceValueMessage")
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translate("resources.transactions.fields.source.header")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate("resources.transactions.storno.selectSourceValue")}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accounts &&
                                        accounts.map((acc: any) => (
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
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translate("resources.transactions.fields.destination.header")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate(
                                                "resources.transactions.storno.selectDestinationValue"
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accounts &&
                                        accounts.map((acc: any) => (
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
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translate("resources.transactions.fields.source.header")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={translate("resources.transactions.storno.selectSourceValue")}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {currencies?.map?.((cur: any) => (
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
                <FormField
                    control={form.control}
                    name="sourceValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translate("resources.transactions.fields.sourceValue")}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="destValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{translate("resources.transactions.fields.destValue")}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{translate("resources.transactions.show.save")}</Button>
            </form>
        </Form>
    );
};
