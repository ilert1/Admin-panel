import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { CurrencyPosition, CurrencyCreate as ICurrencyCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

export const CurrencyCreate = ({ closeDialog }: { closeDialog: () => void }) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<ICurrencyCreate>();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const appToast = useAppToast();

    const translate = useTranslate();
    const refresh = useRefresh();
    const onSubmit: SubmitHandler<ICurrencyCreate> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        data.code = data.code.toUpperCase();
        try {
            await dataProvider.create("currency", { data: data });
            refresh();
            closeDialog();
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        code: z
            .string({ message: translate("resources.currency.errors.code") })
            .min(1, translate("resources.currency.errors.code")),
        position: z.enum([CurrencyPosition.after, CurrencyPosition.before]),
        symbol: z.string().trim().nullable(),
        is_coin: z.boolean().default(false)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            position: CurrencyPosition.before,
            symbol: "",
            is_coin: false
        }
    });

    if (controllerProps.isLoading) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 md:grid-flow-col gap-y-5 gap-x-4 items-baseline">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            className="text-sm"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.currency.fields.currencyName")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="symbol"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            className="text-sm"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.currency.fields.symbol")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            {...field}
                                            value={field.value ?? ""}
                                        />
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
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <div className="mr-auto">
                                                    <SelectValue
                                                        placeholder={translate("resources.currency.fields.type")}
                                                    />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent className="!dark:bg-muted">
                                            <SelectGroup>
                                                <SelectItem value="false" variant={SelectType.GRAY}>
                                                    {translate("resources.currency.fields.fiat")}
                                                </SelectItem>
                                                <SelectItem value="true" variant={SelectType.GRAY}>
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
                                            onValueChange={value => field.onChange(value as CurrencyPosition)}
                                            value={field.value}>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={translate("resources.currency.fields.before")}
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="!dark:bg-muted">
                                                <SelectGroup>
                                                    <SelectItem
                                                        value={CurrencyPosition.before}
                                                        variant={SelectType.GRAY}>
                                                        {translate("resources.currency.fields.before")}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={CurrencyPosition.after}
                                                        variant={SelectType.GRAY}>
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

                    <div className="sm:self-end flex flex-col sm:flex-row items-center gap-4">
                        <Button type="submit" disabled={submitButtonDisabled} className="w-full sm:w flex-1">
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button
                            onClick={() => {
                                closeDialog();
                            }}
                            variant="outline_gray">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
