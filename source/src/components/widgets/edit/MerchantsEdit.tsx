import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField } from "@/components/ui/form";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { usePreventFocus } from "@/hooks";
import { Merchant } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PaymentTypeMultiSelect } from "../components/MultiSelectComponents/PaymentTypeMultiSelect";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { MerchantsDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";

interface MerchantEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantEdit = ({ id = "", onOpenChange }: MerchantEditProps) => {
    const data = fetchDictionaries();
    const dataProvider = useDataProvider();
    const merchantsDataProvider = new MerchantsDataProvider();
    const [isFinished, setIsFinished] = useState(false);

    const appToast = useAppToast();

    const {
        data: merchant,
        isLoading: isLoadingMerchant,
        isFetchedAfterMount
    } = useQuery({
        queryKey: ["merchant", id],
        queryFn: () => dataProvider.getOne<Merchant>("merchant", { id }),
        enabled: true,
        select: data => data.data
    });

    const translate = useTranslate();
    const refresh = useRefresh();
    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        id: z.string().min(1, translate("resources.merchant.errors.id")).trim(),
        name: z.string().min(1, translate("resources.merchant.errors.name")).trim(),
        description: z.string().trim().nullable(),
        keycloak_id: z
            .string()
            .nullable()
            .refine(value => value === null || !/\s/.test(value), {
                message: translate("resources.merchant.errors.noSpaces")
            }),
        payment_types: z.array(z.string()).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            description: "",
            keycloak_id: "",
            payment_types: []
        }
    });

    useEffect(() => {
        if (!isLoadingMerchant && merchant && isFetchedAfterMount) {
            const updatedValues = {
                id: merchant.id || "",
                name: merchant.name || "",
                description: merchant.description || "",
                keycloak_id: merchant.keycloak_id || "",
                payment_types: merchant?.payment_types?.map(pt => pt.code) || []
            };

            form.reset(updatedValues);
            setIsFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchant, isLoadingMerchant, isFetchedAfterMount]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);

        let payment_types: string[] = [];
        let oldPaymentTypes: Set<string> = new Set();

        if (merchant?.payment_types) {
            oldPaymentTypes = new Set(merchant?.payment_types?.map(pt => pt.code));
        }

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        const paymentsToDelete = oldPaymentTypes.difference(new Set(payment_types));

        try {
            await dataProvider.update("merchant", {
                id,
                data,
                previousData: undefined
            });

            await Promise.all(
                [...paymentsToDelete].map(payment =>
                    merchantsDataProvider.removePaymentType({
                        id,
                        data: { code: payment },
                        previousData: undefined
                    })
                )
            );

            await merchantsDataProvider.addPaymentTypes({
                id,
                data: {
                    codes: payment_types
                },
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));
            setSubmitButtonDisabled(false);
        } finally {
            refresh();
        }
    };

    usePreventFocus({ dependencies: [merchant] });

    if (isLoadingMerchant || !merchant || !data || isLoadingAllPaymentTypes || !isFinished)
        return (
            <div className="h-[200px]">
                <Loading />
            </div>
        );
    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
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
                            name="id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.id")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keycloak_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2 sm:w-1/2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label="Keycloak ID"
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
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <PaymentTypeMultiSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={allPaymentTypes || []}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>

            <div className="ml-auto flex w-full flex-col gap-3 space-x-0 p-2 sm:flex-row sm:gap-0 sm:space-x-2 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </>
    );
};
