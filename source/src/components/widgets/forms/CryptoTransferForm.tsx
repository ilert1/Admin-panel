import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { Icon } from "../shared/Icon";

export const CryptoTransferForm = (props: {
    loading: boolean;
    balance: number;
    transferState: "process" | "success" | "error";
    setTransferState: (transferState: "process" | "success" | "error") => void;
    create: (data: any) => void;
}) => {
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

    if (props.transferState === "process")
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="flex flex-col w-[476px] px-6 py-4 bg-neutral-0 rounded-2xl gap-4">
                        <div className="flex-1">
                            <FormField
                                disabled={props.loading}
                                control={form.control}
                                name="address"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-note-1">
                                            {translate("app.widgets.forms.cryptoTransfer.address")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="TRC"
                                                className={`${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
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
                                            </Input>
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
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-note-1">
                                            {translate("app.widgets.forms.cryptoTransfer.amount")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className={`${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}
                                                {...field}>
                                                {fieldState.invalid && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
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
                                            </Input>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex-1 flex gap-2 items-center mt-2">
                                <label
                                    onClick={() => setChecked(!checked)}
                                    className="flex gap-2 items-center self-start cursor-pointer [&>*]:hover:border-green-20 [&>*]:active:border-green-50 [&_#checked]:hover:bg-green-20 [&_#checked]:active:bg-green-50">
                                    <div className="relative w-4 h-4 rounded-full border transition-all bg-black border-neutral-60 flex justify-center items-center">
                                        {checked && (
                                            <div id="checked" className="w-2.5 h-2.5 rounded-full bg-green-50"></div>
                                        )}
                                    </div>
                                    <span className="font-normal text-sm text-neutral-40 transition-all">
                                        {translate("app.widgets.forms.cryptoTransfer.allAmount", {
                                            amount: props.balance
                                        })}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-end gap-6 text-title-1">
                            <div className="flex flex-col items-start">
                                <span>{translate("app.widgets.forms.cryptoTransfer.commission")}</span>
                                <span>2 USD₮</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span>{translate("app.widgets.forms.cryptoTransfer.totalAmount")}</span>
                                <span>{totalAmount + " USD₮"}</span>
                            </div>
                        </div>
                        <Button
                            className="md:ml-auto"
                            disabled={props.loading}
                            type="submit"
                            variant="default"
                            size="sm">
                            {translate("app.widgets.forms.cryptoTransfer.createTransfer")}
                        </Button>
                    </div>
                </form>
            </Form>
        );
    else if (props.transferState === "success" || props.transferState === "error")
        return (
            <div className="flex flex-col w-[476px] h-[308px] px-6 py-4 bg-neutral-0 rounded-2xl gap-6 justify-center items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="w-[114px]">
                        {props.transferState === "success" && <Icon name="BlowFishCheck" />}
                        {props.transferState === "error" && <Icon name="BlowFishCross" />}
                    </div>
                    <span className="text-title-2">
                        {props.transferState === "success"
                            ? translate("app.widgets.forms.cryptoTransfer.transferSuccess")
                            : translate("app.widgets.forms.cryptoTransfer.transferError")}
                    </span>
                </div>
                <div>
                    <Button
                        className="md:ml-auto"
                        type="button"
                        variant="default"
                        onClick={() => {
                            props.setTransferState("process");
                        }}
                        size="sm">
                        {props.transferState === "success"
                            ? translate("app.widgets.forms.cryptoTransfer.successButton")
                            : translate("app.widgets.forms.cryptoTransfer.errorButton")}
                    </Button>
                </div>
            </div>
        );
    else return <></>;
};
