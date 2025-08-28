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
import { TTL } from "../../components/TTL";

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
    const [editClicked, setEditClicked] = useState(false);

    const [ttl, setTTL] = useState({
        depositMin: 0,
        depositMax: 0,
        withdrawMin: 0,
        withdrawMax: 0
    });

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
                        min: ttl.depositMin,
                        max: ttl.depositMax
                    }
                },
                withdraw: {
                    ttl: {
                        min: ttl.withdrawMin,
                        max: ttl.withdrawMax
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

    const formSchema = z.object({
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
        payment_types: z.array(z.string()).optional().default([])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            public_key: "",
            fees: {},
            currencies: [],
            payment_types: []
        }
    });

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
            <TTL
                ttl={ttl}
                onChange={(ttl: { depositMin: number; depositMax: number; withdrawMin: number; withdrawMax: number }) =>
                    setTTL(ttl)
                }
                editClicked={editClicked}
                setEditClicked={setEditClicked}
            />
            <div className="ml-auto flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled || editClicked}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </CreateContextProvider>
    );
};
