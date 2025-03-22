import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useFetchDataForDirections, useGetTerminals } from "@/hooks";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Direction, DirectionCreate as IDirectionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { MerchantSelectFilter } from "../shared/MerchantSelectFilter";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useGetDirectionTypes } from "@/hooks/useGetDirectionTypes";

export const DirectionCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const dataProvider = useDataProvider();
    const { currencies, merchants, providers, isLoading: loadingData } = useFetchDataForDirections();

    const controllerProps = useCreateController<IDirectionCreate>();
    const translate = useTranslate();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const { directionTypes } = useGetDirectionTypes();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const { terminals, getTerminals } = useGetTerminals();
    const onSubmit: SubmitHandler<IDirectionCreate> = async data => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        if (!data.terminal) delete data.terminal;

        try {
            const dataWithLimits = {
                ...data,
                limits: {
                    payin: {
                        min: {
                            quantity: 0,
                            accuracy: 1
                        },
                        max: {
                            quantity: 0,
                            accuracy: 1
                        }
                    },
                    payout: {
                        min: {
                            quantity: 0,
                            accuracy: 1
                        },
                        max: {
                            quantity: 0,
                            accuracy: 1
                        }
                    },
                    reward: {
                        min: {
                            quantity: 0,
                            accuracy: 1
                        },
                        max: {
                            quantity: 0,
                            accuracy: 1
                        }
                    }
                }
            };

            await dataProvider.create<Direction>("direction", { data: dataWithLimits });

            appToast("success", translate("app.ui.create.createSuccess"));
            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.provider.errors.alreadyInUse"));
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.direction.errors.name")).trim(),
        state: z.enum(["active", "inactive"]),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.direction.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.direction.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.direction.errors.merchant")),
        provider: z.string().min(1, translate("resources.direction.errors.provider")),
        terminal: z.string().optional(),
        weight: z.coerce
            .number({ message: translate("resources.direction.errors.weightError") })
            .int(translate("resources.direction.errors.weightError"))
            .min(0, translate("resources.direction.errors.weightError"))
            .max(1000, translate("resources.direction.errors.weightError")),
        type: z.enum(["universal", "withdraw", "deposit"], {
            message: translate("resources.direction.errors.typeError")
        })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            state: "active",
            description: "",
            src_currency: "",
            dst_currency: "",
            merchant: "",
            provider: "",
            terminal: "",
            weight: 0,
            type: "universal"
        }
    });

    if (controllerProps.isLoading || loadingData)
        return (
            <div className="h-[140px]">
                <Loading />
            </div>
        );

    const currenciesDisabled = !(currencies && Array.isArray(currencies.data) && currencies?.data?.length > 0);
    const merchantsDisabled = !(merchants && Array.isArray(merchants.data) && merchants?.data?.length > 0);
    const providersDisabled = !(providers && Array.isArray(providers.data) && providers?.data?.length > 0);
    const terminalsDisabled = !(terminals && Array.isArray(terminals) && terminals?.length > 0);

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("resources.direction.fields.name")}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.fields.active")}</Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.active")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="active" variant={SelectType.GRAY}>
                                                    {translate("resources.direction.fields.stateActive")}
                                                </SelectItem>
                                                <SelectItem value="inactive" variant={SelectType.GRAY}>
                                                    {translate("resources.direction.fields.stateInactive")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="src_currency"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.sourceCurrency")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={currenciesDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        currenciesDisabled
                                                            ? translate("resources.direction.noCurrencies")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!currenciesDisabled
                                                    ? currencies.data.map(currency => (
                                                          <SelectItem
                                                              key={currency.code}
                                                              value={currency.code}
                                                              variant={SelectType.GRAY}>
                                                              {currency.code}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dst_currency"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.destinationCurrency")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={currenciesDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        currenciesDisabled
                                                            ? translate("resources.direction.noCurrencies")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!currenciesDisabled
                                                    ? currencies.data.map(currency => (
                                                          <SelectItem
                                                              key={currency.code}
                                                              value={currency.code}
                                                              variant={SelectType.GRAY}>
                                                              {currency.code}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.merchant")}</Label>
                                    <MerchantSelectFilter
                                        variant="outline"
                                        error={fieldState.error?.message}
                                        merchant={field.value}
                                        onMerchantChanged={field.onChange}
                                        resource="merchant"
                                        disabled={merchantsDisabled}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="provider"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.provider")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={e => {
                                            getTerminals(e);
                                            field.onChange(e);
                                        }}
                                        disabled={providersDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        providersDisabled
                                                            ? translate("resources.direction.noProviders")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!providersDisabled
                                                    ? providers.data.map(provider => (
                                                          <SelectItem
                                                              key={provider.name}
                                                              value={provider.name}
                                                              disabled={provider.public_key ? false : true}
                                                              variant={SelectType.GRAY}>
                                                              {provider.name}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="terminal"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.fields.terminal")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={terminalsDisabled}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={
                                                        terminalsDisabled
                                                            ? translate("resources.direction.noTerminals")
                                                            : ""
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {!terminalsDisabled
                                                    ? terminals.map(terminal => (
                                                          <SelectItem
                                                              key={terminal.terminal_id}
                                                              value={terminal.terminal_id}
                                                              variant={SelectType.GRAY}>
                                                              {terminal.verbose_name}
                                                          </SelectItem>
                                                      ))
                                                    : ""}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? "0"}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.direction.weight")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <Label>{translate("resources.direction.types.type")}</Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {directionTypes.map(type => (
                                                    <SelectItem
                                                        value={type.value}
                                                        variant={SelectType.GRAY}
                                                        key={type.value}>
                                                        {type.translation}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="p-2 w-full sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.direction.description")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex sm:flex-row flex-col gap-3 sm:gap-0 space-x-0 sm:space-x-2 mt-4 md:mt-0 ml-auto p-2 w-full md:w-2/5">
                            <Button type="submit" variant="default" className="flex-1" disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="flex-1"
                                onClick={() => {
                                    onOpenChange(false);
                                }}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
