import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { useRef, useState } from "react";
import { usePreventFocus } from "@/hooks";

enum PositionEnum {
    BEFORE = "before",
    AFTER = "after"
}
let renderCount = 0;

export const CurrencyEdit = ({
    record,
    closeDialog
}: {
    record: Currencies.Currency | undefined;
    closeDialog: () => void;
}) => {
    const dataProvider = useDataProvider();

    const translate = useTranslate();
    const { toast } = useToast();
    const refresh = useRefresh();
    const inputRef = useRef<HTMLInputElement>(null);
    // Focus blur hack
    renderCount++;

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const onSubmit: SubmitHandler<Omit<Currencies.Currency, "id">> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            await dataProvider.update("currency", {
                id: record?.id,
                data: data,
                previousData: undefined
            });
            refresh();
            closeDialog();
        } catch (error) {
            toast({
                description: translate("resources.currency.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        code: z.string().min(1, translate("resources.currency.errors.code")),
        position: z.enum([PositionEnum.AFTER, PositionEnum.BEFORE]),
        symbol: z.string().trim().nullable(),
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

    usePreventFocus({ dependencies: [record] });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoFocus={false}>
                <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 md:grid-flow-col gap-y-5 gap-x-4 md:items-end">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("resources.currency.fields.currencyName")}</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("resources.currency.fields.symbol")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        {...field}
                                        ref={inputRef}
                                        onFocus={() => {
                                            if (renderCount === 1) {
                                                inputRef?.current?.blur();
                                            }
                                            inputRef?.current?.focus();
                                        }}
                                        value={field.value ?? ""}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
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

                    <FormField
                        control={form.control}
                        name="is_coin"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("resources.currency.fields.type")}</FormLabel>
                                <Select
                                    onValueChange={value => field.onChange(value === "true")}
                                    value={field.value ? "true" : "false"}>
                                    <FormControl>
                                        <SelectTrigger
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}>
                                            <div className="mr-auto">
                                                <SelectValue
                                                    placeholder={translate("resources.currency.fields.type")}
                                                />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="false">
                                                {translate("resources.currency.fields.fiat")}
                                            </SelectItem>
                                            <SelectItem value="true">
                                                {translate("resources.currency.fields.crypto")}
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
                        name="position"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("resources.currency.fields.symbPos")}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={value => field.onChange(value as PositionEnum)}
                                        value={field.value}>
                                        <SelectTrigger
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}>
                                            <div className="mr-auto">
                                                <SelectValue
                                                    placeholder={translate("resources.currency.fields.symbPos")}
                                                />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={PositionEnum.BEFORE}>
                                                    {translate("resources.currency.fields.before")}
                                                </SelectItem>
                                                <SelectItem value={PositionEnum.AFTER}>
                                                    {translate("resources.currency.fields.after")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="sm:self-end flex flex-col sm:flex-row items-center gap-4">
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full sm:w flex-1"
                        disabled={submitButtonDisabled}>
                        {translate("app.ui.actions.save")}
                    </Button>

                    <DialogClose asChild>
                        <Button
                            variant="clearBtn"
                            className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </DialogClose>
                </div>
            </form>
        </Form>
    );
};
