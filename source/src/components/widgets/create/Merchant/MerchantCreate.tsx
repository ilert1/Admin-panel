import { useCreateController, CreateContextProvider, useTranslate, useRefresh } from "react-admin";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangeEvent, DragEvent, useState } from "react";
import { feesDataProvider, FeesResource, MerchantsDataProvider } from "@/data";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeeCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useSheets } from "@/components/providers/SheetProvider";
import { useCurrenciesListWithoutPagination, useFetchDictionaries } from "@/hooks";
import { Fees } from "../../components/Fees";
import { CurrenciesMultiSelect } from "../../components/MultiSelectComponents/CurrenciesMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { PaymentTypeMultiSelect } from "../../components/MultiSelectComponents/PaymentTypeMultiSelect";

export type FeeType = "inner" | "default";

export const MerchantCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const { currenciesData, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const { openSheet } = useSheets();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const controllerProps = useCreateController();
    const data = useFetchDictionaries();
    const feeDataProvider = feesDataProvider({ id: "", resource: FeesResource.MERCHANT });
    const merchantsDataProvider = new MerchantsDataProvider();

    const [fees, setFees] = useState<FeeCreate[]>([]);

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [fileContent, setFileContent] = useState("");

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setFileContent(reader.result.replaceAll("\n", ""));
                    form.setValue("public_key", reader.result.replaceAll("\n", ""));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        setFileContent(e.target.value);
        form.setValue("public_key", e.target.value);
        field.onChange(e.target.value);
    };

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async data => {
        console.log("Submit");

        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        const formData = {
            ...data,
            settings: {
                deposit: {
                    ttl: {
                        min: form.getValues("minTTLDep"),
                        max: form.getValues("maxTTLDep")
                    }
                },
                withdraw: {
                    ttl: {
                        min: form.getValues("minTTLWith"),
                        max: form.getValues("maxTTLWith")
                    }
                },
                connection: {
                    ttl: {
                        max: form.getValues("maxConnectionTTL")
                    }
                }
            }
        };

        if (formData?.description?.length === 0) {
            formData.description = null;
        }

        try {
            const json = await merchantsDataProvider.createNewFlow({ data: formData });
            feeDataProvider.setId(json.data.id);

            await fees.reduce((accum, item) => {
                return accum.then(() => feeDataProvider.addFee(item));
            }, Promise.resolve());

            appToast(
                "success",
                <span>
                    {translate("resources.merchant.success.create", { name: data.name })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("merchant", { id: json.data.id, merchantName: data.name })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.merchant.errors.alreadyInUse"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const formSchema = z
        .object({
            name: z
                .string({ message: translate("resources.merchant.errors.required") })
                .min(1, translate("resources.merchant.errors.name"))
                .trim(),
            public_key: z
                .string({ message: translate("resources.merchant.errors.required") })
                .startsWith("-----BEGIN PUBLIC KEY-----", translate("resources.merchant.errors.publicKey"))
                .endsWith("-----END PUBLIC KEY-----", translate("resources.merchant.errors.publicKey")),
            description: z.string().trim().nullable(),
            fees: z.record(
                z.object({
                    type: z.number(),
                    value: z.number(),
                    currency: z.string(),
                    recipient: z.string(),
                    direction: z.string()
                })
            ),
            currencies: z.array(z.string()).optional(),
            payment_types: z.array(z.string()).optional().default([]),
            minTTLDep: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxTTLDep: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            minTTLWith: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxTTLWith: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(999999999.99),
            maxConnectionTTL: z.coerce
                .number()
                .min(0, translate("app.widgets.limits.errors.minTooSmallForOne"))
                .max(60001)
        })
        .refine(
            data => {
                if (data.maxTTLDep === 0) {
                    return true;
                }

                return data.minTTLDep <= data.maxTTLDep;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["maxTTLDep"]
            }
        )
        .refine(
            data => {
                if (data.maxTTLWith === 0) {
                    return true;
                }

                return data.minTTLWith <= data.maxTTLWith;
            },
            {
                message: translate("app.widgets.ttl.errors.minGreaterThanMax"),
                path: ["maxTTLWith"]
            }
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            public_key: "",
            fees: {},
            currencies: [],
            payment_types: [],
            minTTLDep: 0,
            maxTTLDep: 0,
            minTTLWith: 0,
            maxTTLWith: 0,
            maxConnectionTTL: 0
        }
    });

    const handleChange = (
        key: "minTTLDep" | "maxTTLDep" | "minTTLWith" | "maxTTLWith" | "maxConnectionTTL",
        value: string
    ) => {
        value = value.replace(/[^0-9.]/g, "");

        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts[1];
        }

        if (parts.length === 2 && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join(".");
        }

        if (/^0[0-9]+/.test(value) && !value.startsWith("0.")) {
            value = value.replace(/^0+/, "") || "0";
        }

        if (value === "") {
            form.resetField(key);
            return;
        }

        if (value.endsWith(".") || value === "0.") {
            return;
        }

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            let finalValue = numericValue;

            if (numericValue > 60000) {
                finalValue = 60000;
            }
            if (numericValue < 0) {
                finalValue = 0;
            }

            form.setValue(key, finalValue);
        }
    };

    if (controllerProps.isLoading || !data)
        return (
            <div className="h-[200px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className=""
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
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
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxConnectionTTL"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxConnectionTTL")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxConnectionTTL", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minTTLDep"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.minTTLDep")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("minTTLDep", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxTTLDep"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxTTLDep")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxTTLDep", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minTTLWith"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.minTTLWith")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("minTTLWith", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxTTLWith"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            label={translate("app.widgets.ttl.maxTTLWith")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            onChange={e => handleChange("maxTTLWith", e.target.value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payment_types"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
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
                            name="currencies"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <CurrenciesMultiSelect
                                        labelValue={translate("resources.merchant.fields.currencies")}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={currenciesData || []}
                                        isLoading={currenciesLoadingProcess}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="w-full p-2" onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}>
                            <FormField
                                name="public_key"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex h-full flex-col space-y-0">
                                        <Label>{translate("app.widgets.forms.userCreate.publicKey")}</Label>
                                        <FormControl>
                                            <Textarea
                                                value={fileContent}
                                                onChange={e => handleTextChange(e, field)}
                                                placeholder={translate(
                                                    "app.widgets.forms.userCreate.publicKeyPlaceholder"
                                                )}
                                                className={`h-full min-h-20 resize-none dark:bg-muted`}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
            <Fees id={""} fees={fees} feesResource={FeesResource.MERCHANT} setFees={setFees} feeType="inner" />
            <div className="ml-auto flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </CreateContextProvider>
    );
};
