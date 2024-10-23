import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useEffect, useMemo, useState } from "react";
import { TextField } from "@/components/ui/text-field";

export const CryptoTransferForm = (props: { loading: boolean; balance: number; create: (data: any) => void }) => {
    const translate = useTranslate();
    const [checked, setChecked] = useState<boolean | "indeterminate">(false);
    const formSchema = z.object({
        address: z.string().regex(/T[A-Za-z1-9]{33}/, translate("app.widgets.forms.cryptoTransfer.addressMessage")),
        amount: z
            .string()
            .regex(/^[+-]?([0-9]*[.])?[0-9]+$/, translate("app.widgets.forms.cryptoTransfer.amountMessage"))
            .transform(v => parseInt(v))
            .pipe(
                z
                    .number()
                    .min(2, translate("app.widgets.forms.cryptoTransfer.amountMinMessage"))
                    .max(
                        props.balance,
                        translate("app.widgets.forms.cryptoTransfer.amountMaxMessage", { amount: props.balance })
                    )
            )
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

    useEffect(() => {
        if (checked && checked !== "indeterminate") form.setValue("amount", props.balance?.toString() || "");
    }, [checked]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="flex flex-col w-[476px] px-6 pt-4 bg-neutral-0 rounded-2xl gap-4">
                    <div className="flex-1">
                        <FormField
                            disabled={props.loading}
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-note-1">
                                        {translate("app.widgets.forms.cryptoTransfer.address")}
                                    </FormLabel>
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
                                    <FormLabel className="text-note-1">
                                        {translate("app.widgets.forms.cryptoTransfer.amount")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex-1 flex gap-2 items-center">
                            <label
                                onClick={() => setChecked(!checked)}
                                className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                <div className="relative w-4 h-4 rounded-full border transition-all bg-black border-neutral-60 flex justify-center items-center">
                                    {checked && (
                                        <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>
                                    )}
                                </div>
                                <span className="font-normal text-sm text-neutral-40 transition-all">
                                    {translate("app.widgets.forms.cryptoTransfer.allAmount", { amount: props.balance })}
                                </span>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex-1">
                                <TextField
                                    label={translate("app.widgets.forms.cryptoTransfer.commission")}
                                    text="2 USD₮"
                                />
                            </div>
                            <div className="flex-1">
                                <TextField
                                    label={translate("app.widgets.forms.cryptoTransfer.totalAmount")}
                                    text={totalAmount + " USD₮"}
                                />
                            </div>
                        </div>
                    </div>
                    <Button disabled={props.loading} type="submit">
                        {translate("app.widgets.forms.payin.createOrder")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
