import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loading } from "@/components/ui/loading";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

enum PositionEnum {
    BEFORE = "before",
    AFTER = "after"
}

export const CurrencyCreate = ({ closeDialog }: { closeDialog: () => void }) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();
    const onSubmit: SubmitHandler<Omit<Currencies.Currency, "id">> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        data.code = data.code.toUpperCase();
        try {
            await dataProvider.create("currency", { data: data });
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
            code: "",
            position: undefined,
            symbol: "",
            is_coin: false
        }
    });

    if (controllerProps.isLoading) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 md:grid-flow-col gap-y-5 gap-x-4 md:items-end">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>{translate("resources.currency.fields.currencyName")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
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

                                                        <TooltipContent className="border-none bottom-0" side="left">
                                                            <FormMessage />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </Input>
                                    </FormControl>
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
                                            value={field.value ?? ""}>
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

                                                        <TooltipContent className="border-none bottom-0" side="left">
                                                            <FormMessage />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </Input>
                                    </FormControl>
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

                                        <SelectContent className="!dark:bg-muted">
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
                                                className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted  ${
                                                    fieldState.invalid
                                                        ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                        : ""
                                                }`}>
                                                <div className="mr-auto">
                                                    <SelectValue
                                                        placeholder={translate("resources.currency.fields.before")}
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

                                            <SelectContent className="!dark:bg-muted">
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
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="self-end flex items-center gap-4">
                        <Button type="submit" variant="default" disabled={submitButtonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <DialogClose asChild>
                            <Button
                                variant="clearBtn"
                                className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
