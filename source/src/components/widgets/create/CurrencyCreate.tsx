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
        is_coin: z.boolean().default(false),
        accuracy: z.optional(
            z.coerce
                .number({ message: translate("resources.currency.errors.intOnly") })
                .int(translate("resources.currency.errors.intOnly"))
                .min(1, translate("resources.currency.errors.minVal"))
                .max(16, translate("resources.currency.errors.maxVal"))
                .optional()
        )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            position: CurrencyPosition.before,
            symbol: "",
            is_coin: false,
            accuracy: undefined
        }
    });

    if (controllerProps.isLoading) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="flex flex-col items-stretch md:items-baseline gap-x-4 gap-y-5 md:grid md:grid-cols-2 md:grid-rows-2">
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
                        <FormField
                            control={form.control}
                            name="accuracy"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input
                                            className="text-sm"
                                            placeholder="2"
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.currency.fields.accuracy")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            inputMode="numeric"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col sm:items-center sm:self-end gap-4">
                        <Button type="submit" disabled={submitButtonDisabled}>
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button
                            type="button"
                            onClick={closeDialog}
                            variant="outline_gray"
                            className="border border-neutral-50 hover:border-neutral-100 rounded-4">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
