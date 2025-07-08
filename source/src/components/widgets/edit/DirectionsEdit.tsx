import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useCurrenciesListWithoutPagination, usePreventFocus } from "@/hooks";
import { Label } from "@/components/ui/label";
import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useGetDirectionTypes } from "@/hooks/useGetDirectionTypes";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { DirectionsDataProvider } from "@/data";
import { PaymentTypeModel } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useQuery } from "@tanstack/react-query";
import { CurrencySelect } from "../components/Selects/CurrencySelect";

export interface DirectionEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const DirectionEdit = ({ id, onOpenChange }: DirectionEditProps) => {
    const dataProvider = useDataProvider();
    const directionDataProvider = new DirectionsDataProvider();
    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();

    const [isFinished, setIsFinished] = useState(false);

    const {
        data: direction,
        isLoading: isLoadingDirection,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["direction", id],
        queryFn: ({ signal }) => dataProvider.getOne<Direction>("direction", { id: id ?? "", signal }),
        enabled: true,
        select: data => data.data
    });
    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();

    const { directionTypes } = useGetDirectionTypes();

    function mergeByCodeIntersection(
        arr1: PaymentTypeModel[] | undefined,
        arr2: PaymentTypeModel[] | undefined
    ): PaymentTypeModel[] {
        if (!arr1 || !arr2) return [];

        const map1 = new Map<string, PaymentTypeModel>();
        for (const item of arr1) {
            map1.set(item.code, item);
        }

        const result: PaymentTypeModel[] = [];
        for (const item of arr2) {
            const matched = map1.get(item.code);
            if (matched) {
                result.push({ ...matched, ...item });
            }
        }

        return result;
    }

    const { merchantPaymentTypes, terminalPaymentTypes, isLoadingMerchantPaymentTypes, isLoadingTerminalPaymentTypes } =
        useGetPaymentTypes({
            merchant: direction?.merchant.id || "",
            terminal: direction?.terminal?.terminal_id || "",
            provider: direction?.provider.name || "",
            disabled: isLoadingDirection
        });

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.direction.errors.name")).trim(),
        state: z.enum(["active", "inactive"]),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.direction.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.direction.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.direction.errors.merchant")),
        provider: z.string().min(1, translate("resources.direction.errors.provider")),
        terminal: z.string().min(1, translate("resources.direction.errors.terminal")),
        weight: z.coerce
            .number({ message: translate("resources.direction.errors.weightError") })
            .int(translate("resources.direction.errors.weightError"))
            .min(0, translate("resources.direction.errors.weightError"))
            .max(1000, translate("resources.direction.errors.weightError")),
        type: z.enum(["universal", "withdraw", "deposit"], {
            message: translate("resources.direction.errors.typeError")
        }),
        payment_types: z.array(z.string()).optional()
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
            type: "universal",
            payment_types: []
        }
    });

    useEffect(() => {
        if (!isLoadingDirection && direction && isFetchedAfterMount) {
            const updatedValues = {
                name: direction.name || "",
                state: direction.state || undefined,
                description: direction.description || "",
                src_currency: direction.src_currency.code || "",
                dst_currency: direction.dst_currency.code || "",
                merchant: direction.merchant.id || "",
                provider: direction.provider.name || "",
                terminal: direction.terminal.terminal_id || "",
                weight: direction.weight || 0,
                type: direction.type || undefined,
                payment_types: direction?.payment_types?.map(pt => pt.code) || []
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction, isLoadingDirection, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        let payment_types: string[] = [];
        let oldPaymentTypes: Set<string> = new Set();

        if (direction?.payment_types) {
            oldPaymentTypes = new Set(direction?.payment_types?.map(pt => pt.code));
        }

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

        try {
            await dataProvider.update<Direction>("direction", {
                id,
                data,
                previousData: undefined
            });

            await Promise.all(
                [...paymentsToDelete].map(payment =>
                    directionDataProvider.removePaymentType({
                        id,
                        data: { code: payment },
                        previousData: undefined
                    })
                )
            );

            await directionDataProvider.addPaymentTypes({
                id,
                data: {
                    codes: payment_types
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("app.ui.edit.editError"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({ dependencies: [direction] });

    if (
        isLoadingDirection ||
        !direction ||
        isCurrenciesLoading ||
        isLoadingMerchantPaymentTypes ||
        isLoadingTerminalPaymentTypes ||
        !isFinished
    )
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    const mergedPaymentTypes = mergeByCodeIntersection(merchantPaymentTypes, terminalPaymentTypes);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-wrap">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.direction.fields.name")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="w-full p-2 sm:w-1/2">
                        <Input
                            value={direction.merchant.name || ""}
                            disabled
                            variant={InputTypes.GRAY}
                            label={translate("resources.direction.merchant")}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="src_currency"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <Label>{translate("resources.direction.sourceCurrency")}</Label>
                                <CurrencySelect
                                    currencies={currenciesData || []}
                                    value={field.value}
                                    onChange={field.onChange}
                                    isError={fieldState.invalid}
                                    errorMessage={<FormMessage />}
                                    disabled={currenciesLoadingProcess}
                                    modal
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dst_currency"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <Label>{translate("resources.direction.destinationCurrency")}</Label>
                                <CurrencySelect
                                    currencies={currenciesData || []}
                                    value={field.value}
                                    onChange={field.onChange}
                                    isError={fieldState.invalid}
                                    errorMessage={<FormMessage />}
                                    disabled={currenciesLoadingProcess}
                                    modal
                                />
                            </FormItem>
                        )}
                    />

                    <div className="w-full p-2 sm:w-1/2">
                        <Input
                            value={direction.provider.name || ""}
                            disabled
                            variant={InputTypes.GRAY}
                            label={translate("resources.direction.provider")}
                        />
                    </div>

                    <div className="w-full p-2 sm:w-1/2">
                        <Input
                            value={direction.terminal.verbose_name || ""}
                            disabled
                            variant={InputTypes.GRAY}
                            label={translate("resources.direction.fields.terminal")}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <Label>{translate("resources.direction.fields.active")}</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue placeholder={translate("resources.direction.fields.active")} />
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
                        name="weight"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <FormControl>
                                    <Input
                                        {...field}
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
                            <FormItem className="w-full p-2 sm:w-1/2">
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
                            <FormItem className="w-full p-2 sm:w-1/2">
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
                    <FormField
                        control={form.control}
                        name="payment_types"
                        render={({ field }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <FormControl>
                                    <PaymentTypeMultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={mergedPaymentTypes}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="ml-auto mt-4 flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:mt-0 md:w-2/5">
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
            </form>
        </Form>
    );
};
