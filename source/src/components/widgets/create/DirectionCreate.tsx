import {
    useCreateController,
    CreateContextProvider,
    useTranslate,
    useDataProvider,
    useRefresh,
    useListContext
} from "react-admin";
import { useForm } from "react-hook-form";
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
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { DirectionCreate as IDirectionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useGetDirectionTypes } from "@/hooks/useGetDirectionTypes";
import { useSheets } from "@/components/providers/SheetProvider";
import { CurrencySelect } from "../components/Selects/CurrencySelect";
import { ProviderSelect } from "../components/Selects/ProviderSelect";
import { PopoverSelect } from "../components/Selects/PopoverSelect";
import { MerchantSelect } from "../components/Selects/MerchantSelect";
import {
    useCurrenciesListWithoutPagination,
    useMerchantsListWithoutPagination,
    useProvidersListWithoutPagination,
    useTerminalsListWithoutPagination
} from "@/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import clsx from "clsx";

const kindArray: string[] = ["sequential", "fanout"];

export const DirectionCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const controllerProps = useCreateController<IDirectionCreate>();
    const dataProvider = useDataProvider();
    const { directionTypes } = useGetDirectionTypes();
    const translate = useTranslate();
    const refresh = useRefresh();
    const { filterValues } = useListContext();
    const { openSheet } = useSheets();
    const appToast = useAppToast();

    const [touchSelectTypeField, setTouchSelectTypeField] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [terminalValueName, setTerminalValueName] = useState("");
    const [providerName, setProviderName] = useState("");
    const [merchantName, setMerchantName] = useState("");

    const { merchantData, merchantsLoadingProcess, isMerchantsLoading } = useMerchantsListWithoutPagination();
    const { providersData, isProvidersLoading, providersLoadingProcess } = useProvidersListWithoutPagination();
    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const { terminalsData, terminalsLoadingProcess } = useTerminalsListWithoutPagination(providerName);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            const dataWithLimits = {
                ...data,
                limits: {
                    payin: {
                        min: {
                            quantity: 1,
                            accuracy: 1
                        },
                        max: {
                            quantity: 0,
                            accuracy: 1
                        }
                    },
                    payout: {
                        min: {
                            quantity: 1,
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

            const res = await dataProvider.create<IDirectionCreate>("direction", { data: dataWithLimits });

            appToast(
                "success",
                <span>
                    {translate("resources.direction.success.create", { name: data.name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("direction", { id: res.data.id as string })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.provider.errors.alreadyInUse")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
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
        terminal: z.string().min(1, translate("resources.direction.errors.terminal")),
        weight: z.coerce
            .number({ message: translate("resources.direction.errors.weightError") })
            .int(translate("resources.direction.errors.weightError"))
            .min(0, translate("resources.direction.errors.weightError"))
            .max(1000, translate("resources.direction.errors.weightError")),
        type: z
            .enum(directionTypes.map(type => type.value) as [string, ...string[]], {
                message: translate("resources.direction.errors.typeError")
            })
            .default("withdraw"),
        kind: z.enum(kindArray as [string, ...string[]])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            state: "inactive",
            description: "",
            src_currency: "",
            dst_currency: "",
            merchant: "",
            provider: "",
            terminal: "",
            weight: 0,
            type: "withdraw",
            kind: "sequential"
        }
    });

    useEffect(() => {
        if (filterValues?.provider && providersData && providersData?.length > 0) {
            const provider = providersData.find(provider => provider.name === filterValues.provider);

            if (provider) {
                setProviderName(provider.name);
                form.setValue("provider", provider.name);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providersData]);

    useEffect(() => {
        if (filterValues?.merchant && merchantData && merchantData?.length > 0) {
            const merchant = merchantData.find(merchant => merchant.id === filterValues.merchant);

            if (merchant) {
                setMerchantName(merchant.name);
                form.setValue("merchant", merchant.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData]);

    const typeWatchValue = form.watch("type");

    const generateDirectionName = () => {
        form.setValue(
            "name",
            `[${merchantName}] [${providerName}/${terminalValueName}] [${typeWatchValue.charAt(0).toUpperCase()}]`
        );
        form.trigger("name");
    };

    const onChangeProviderName = (val: string) => {
        setProviderName(val);
        setTerminalValueName("");
        form.setValue("terminal", "");
    };

    const generateDirectionNamePlaceholder = useMemo(() => {
        if (providerName || terminalValueName || merchantName || touchSelectTypeField) {
            let placeholder = `[${typeWatchValue.charAt(0).toUpperCase()}]`;

            if (providerName) {
                if (terminalValueName) {
                    placeholder = `[${providerName}/${terminalValueName}] ${placeholder}`;
                } else {
                    placeholder = `[${providerName}/-] ${placeholder}`;
                }
            }

            if (merchantName) {
                placeholder = `[${merchantName}] ${placeholder}`;
            }

            return placeholder;
        } else {
            return translate("resources.direction.btnGeneratePlaceholder");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantName, providerName, terminalValueName, typeWatchValue]);

    if (controllerProps.isLoading || isCurrenciesLoading || isMerchantsLoading || isProvidersLoading)
        return (
            <div className="h-[140px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                        <div className="flex items-end gap-2 md:col-span-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <>
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={generateDirectionNamePlaceholder}
                                                    label={translate("resources.direction.fields.name")}
                                                    variant={InputTypes.GRAY}
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        disabled={!merchantName || !providerName || !terminalValueName}
                                                        onClick={generateDirectionName}
                                                        className={clsx(
                                                            "!pointer-events-auto h-[38px]",
                                                            fieldState.invalid && "self-center"
                                                        )}>
                                                        {translate("resources.direction.btnGenerate")}
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipPortal>
                                                    <TooltipContent>
                                                        {translate("resources.direction.btnGenerateTooltip")}
                                                    </TooltipContent>
                                                </TooltipPortal>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field, fieldState }) => (
                                <FormItem className="md:col-span-2">
                                    <Label>{translate("resources.direction.merchant")}</Label>

                                    <MerchantSelect
                                        merchants={merchantData || []}
                                        value={merchantName}
                                        onChange={setMerchantName}
                                        setIdValue={field.onChange}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={merchantsLoadingProcess}
                                        isLoading={merchantsLoadingProcess}
                                        modal
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.direction.provider")}</Label>
                                    <ProviderSelect
                                        providers={providersData || []}
                                        value={field.value}
                                        onChange={val => {
                                            onChangeProviderName(val);
                                            field.onChange(val);
                                        }}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={providersLoadingProcess}
                                        modal
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="terminal"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.direction.fields.terminal")}</Label>
                                    <PopoverSelect
                                        variants={terminalsData || []}
                                        value={terminalValueName}
                                        idField="terminal_id"
                                        setIdValue={field.onChange}
                                        onChange={setTerminalValueName}
                                        variantKey="verbose_name"
                                        placeholder={
                                            providerName
                                                ? translate("resources.terminals.selectPlaceholder")
                                                : translate("resources.direction.noTerminals")
                                        }
                                        commandPlaceholder={translate("app.widgets.multiSelect.searchPlaceholder")}
                                        notFoundMessage={translate("resources.terminals.notFoundMessage")}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={terminalsLoadingProcess || !providerName}
                                        modal
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="src_currency"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.direction.sourceCurrency")}</Label>
                                    <CurrencySelect
                                        currencies={currenciesData || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
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
                                <FormItem>
                                    <Label>{translate("resources.direction.destinationCurrency")}</Label>
                                    <CurrencySelect
                                        currencies={currenciesData || []}
                                        value={field.value}
                                        onChange={field.onChange}
                                        isError={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                        disabled={currenciesLoadingProcess}
                                        modal
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.direction.types.type")}</Label>
                                    <Select
                                        value={field.value}
                                        onValueChange={val => {
                                            setTouchSelectTypeField(true);
                                            field.onChange(val);
                                        }}>
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
                            name="weight"
                            render={({ field, fieldState }) => (
                                <FormItem>
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
                            name="state"
                            render={({ field, fieldState }) => (
                                <FormItem>
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
                            name="kind"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <Label>{translate("resources.direction.fields.kinds.kind")}</Label>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger
                                                variant={SelectType.GRAY}
                                                isError={fieldState.invalid}
                                                errorMessage={<FormMessage />}>
                                                <SelectValue
                                                    placeholder={translate("resources.direction.fields.kinds.kind")}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {kindArray.map(kind => {
                                                    return (
                                                        <SelectItem value={kind} variant={SelectType.GRAY} key={kind}>
                                                            {translate(`resources.direction.fields.kinds.${kind}`)}
                                                        </SelectItem>
                                                    );
                                                })}
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
                                <FormItem>
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
        </CreateContextProvider>
    );
};
