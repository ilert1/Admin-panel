import { useTranslate, useRefresh } from "react-admin";
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
import { useCountryCodes, usePreventFocus } from "@/hooks";
import { Label } from "@/components/ui/label";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useQuery } from "@tanstack/react-query";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { CascadesDataProvider } from "@/data";
import { CASCADE_KIND, CASCADE_STATE, CASCADE_TYPE } from "@/data/cascades";
import { CascadeUpdateParams } from "@/data/cascades";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { CountrySelect } from "../components/Selects/CountrySelect";

export interface CascadeEditProps {
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const CascadeEdit = ({ id, onOpenChange }: CascadeEditProps) => {
    const cascadesDataProvider = new CascadesDataProvider();

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const [hasValid, setHasValid] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [currentCountryCodeName, setCurrentCountryCodeName] = useState("");

    const {
        data: cascadeData,
        isLoading: isLoadingCascadeData,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["cascade", id],
        queryFn: ({ signal }) => cascadesDataProvider.getOne("cascade", { id, signal }),
        enabled: true,
        select: data => data.data
    });
    const appToast = useAppToast();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const translate = useTranslate();
    const refresh = useRefresh();
    const { countryCodesWithFlag } = useCountryCodes();

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim(),
        dst_country_code: z
            .string()
            .regex(/^\w{2}$/, translate("resources.paymentSettings.financialInstitution.errors.country_code"))
            .trim()
            .optional()
            .or(z.literal("")),
        type: z.enum([CASCADE_TYPE[0], ...CASCADE_TYPE.slice(0)]).default(CASCADE_TYPE[0]),
        priority_policy: z.object({
            rank: z.coerce
                .number({ message: translate("resources.cascadeSettings.cascades.errors.rankRequired") })
                .int(translate("resources.cascadeSettings.cascades.errors.rankRequired"))
                .min(1, translate("resources.cascadeSettings.cascades.errors.rankMin"))
        }),
        cascade_kind: z.enum([CASCADE_KIND[0], ...CASCADE_KIND.slice(0)]).default(CASCADE_KIND[0]),
        state: z.enum([CASCADE_STATE[0], ...CASCADE_STATE.slice(0)]).default(CASCADE_STATE[0]),
        payment_types: z.array(z.string()).optional().default([]),
        description: z.string().trim().optional(),
        details: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: CASCADE_TYPE[0],
            dst_country_code: "",
            priority_policy: {
                rank: undefined
            },
            cascade_kind: CASCADE_KIND[0],
            state: CASCADE_STATE[0],
            payment_types: [],
            description: "",
            details: "{}"
        }
    });

    useEffect(() => {
        if (!isLoadingCascadeData && cascadeData && isFetchedAfterMount) {
            const updatedValues = {
                name: cascadeData.name || "",
                type: cascadeData.type || CASCADE_TYPE[0],
                dst_country_code: cascadeData.dst_country_code || "",
                priority_policy: {
                    rank: cascadeData.priority_policy.rank || undefined
                },
                src_currency: cascadeData.src_currency.code || "",
                cascade_kind: cascadeData.cascade_kind || CASCADE_KIND[0],
                state: cascadeData.state || CASCADE_STATE[0],
                payment_types: cascadeData.payment_types?.map(pt => pt.code) || [],
                description: cascadeData.description || "",
                details: JSON.stringify(cascadeData.details, null, 2) || "{}"
            };

            setCurrentCountryCodeName(
                countryCodesWithFlag.find(code => code.alpha2 === cascadeData.dst_country_code)?.name || ""
            );

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cascadeData, isLoadingCascadeData, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        try {
            await cascadesDataProvider.update("cascades", {
                id,
                data: {
                    ...data,
                    dst_country_code: data.dst_country_code || null,
                    details: data.details && data.details.length !== 0 ? JSON.parse(data.details) : {}
                },
                previousData: cascadeData as CascadeUpdateParams
            });

            appToast("success", translate("app.ui.edit.editSuccess"));

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                appToast(
                    "error",
                    error.message.includes("already exist")
                        ? translate("resources.cascadeSettings.cascades.errors.alreadyExist")
                        : error.message
                );
            } else {
                appToast("error", translate("app.ui.edit.editError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({ dependencies: [cascadeData] });

    if (isLoadingCascadeData || !cascadeData || !isFinished)
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.cascadeSettings.cascades.fields.name")}
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
                                <Label>{translate("resources.cascadeSettings.cascades.fields.state")}</Label>
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
                                            {CASCADE_STATE.map(state => (
                                                <SelectItem value={state} variant={SelectType.GRAY} key={state}>
                                                    {translate(`resources.cascadeSettings.cascades.state.${state}`)}
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
                            <FormItem className="col-span-1 sm:col-span-2">
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.cascadeSettings.cascades.fields.description")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payment_types"
                        render={({ field }) => (
                            <FormItem className="col-span-1 sm:col-span-2">
                                <FormControl>
                                    <PaymentTypeMultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={allPaymentTypes || []}
                                        isLoading={isLoadingAllPaymentTypes}
                                        disabled={submitButtonDisabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dst_country_code"
                        render={({ field, fieldState }) => {
                            return (
                                <FormItem>
                                    {!cascadeData.dst_country_code ? (
                                        <>
                                            <Label>{translate("resources.direction.destinationCountry")}</Label>

                                            <CountrySelect
                                                value={currentCountryCodeName}
                                                onChange={setCurrentCountryCodeName}
                                                setIdValue={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                                modal
                                            />
                                        </>
                                    ) : (
                                        <Input
                                            value={currentCountryCodeName}
                                            label={translate("resources.direction.destinationCountry")}
                                            disabled
                                            variant={InputTypes.GRAY}
                                        />
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.cascadeSettings.cascades.fields.type")}</Label>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger
                                            disabled
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {CASCADE_TYPE.map(type => (
                                                <SelectItem value={type} variant={SelectType.GRAY} key={type}>
                                                    {translate(`resources.cascadeSettings.cascades.types.${type}`)}
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
                        name="cascade_kind"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <Label>{translate("resources.cascadeSettings.cascades.fields.cascade_kind")}</Label>
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
                                            {CASCADE_KIND.map(kind => (
                                                <SelectItem value={kind} variant={SelectType.GRAY} key={kind}>
                                                    {translate(`resources.cascadeSettings.cascades.kinds.${kind}`)}
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
                        name="priority_policy.rank"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        label={translate("resources.cascadeSettings.cascades.fields.rank")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-1 sm:col-span-2">
                                    <Label>{translate("resources.cascadeSettings.cascades.fields.details")}</Label>
                                    <FormControl>
                                        <MonacoEditor
                                            onErrorsChange={setHasErrors}
                                            onValidChange={setHasValid}
                                            onMountEditor={() => setMonacoEditorMounted(true)}
                                            code={field.value ?? "{}"}
                                            setCode={field.onChange}
                                            allowEmptyValues
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <div className="ml-auto mt-4 flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:mt-0 md:w-2/5">
                    <Button
                        type="submit"
                        variant="default"
                        className="flex-1"
                        disabled={
                            hasErrors ||
                            (!hasValid && form.watch("details")?.length !== 0) ||
                            !monacoEditorMounted ||
                            submitButtonDisabled
                        }>
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
