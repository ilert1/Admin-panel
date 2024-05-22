import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useMemo } from "react";
import { TextField } from "@/components/ui/text-field";

export const PayOutCryptoForm = (props: { loading: boolean; create: (data: any) => void }) => {
    const translate = useTranslate();

    const formSchema = z.object({
        address: z.string().regex(/T[A-Za-z1-9]{33}/, translate("app.widgets.forms.cryptoTransfer.addressMessage")),
        amount: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("app.widgets.forms.cryptoTransfer.amountMessage"))
            .transform(v => parseInt(v))
            .pipe(z.number().min(2, translate("app.widgets.forms.cryptoTransfer.amountMinMessage")))
            .transform(v => v.toString())
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
            amount: ""
        }
    });

    const amount = form.watch("amount");

    const accuracy = useMemo(() => Math.pow(10, ("" + amount).split(".")[1]?.length) || 100, [amount]);

    const totalAmount = useMemo(() => {
        if (+amount > 2) {
            return Math.round((+amount - 2) * accuracy) / accuracy;
        } else {
            return 0;
        }
    }, [amount, accuracy]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        props.create({
            ...values,
            accuracy
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex-1">
                        <FormField
                            disabled={props.loading}
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.cryptoTransfer.address")}</FormLabel>
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
                            disabled={props.loading}
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translate("app.widgets.forms.cryptoTransfer.amount")} (USD₮)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex-1">
                        <TextField label={translate("app.widgets.forms.cryptoTransfer.commission")} text="2 USD₮" />
                    </div>
                    <div className="flex-1">
                        <TextField
                            label={translate("app.widgets.forms.cryptoTransfer.totalAmount")}
                            text={totalAmount + " USD₮"}
                        />
                    </div>
                </div>
                <Button disabled={props.loading} type="submit">
                    {translate("app.widgets.forms.payin.createOrder")}
                </Button>
            </form>
        </Form>
    );
};
