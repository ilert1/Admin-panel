import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import { MerchantSelect } from "../components/Selects/MerchantSelect";
import { CascadeSelect } from "../components/Selects/CascadeSelect";
import { useCascadesListWithoutPagination } from "@/hooks/useCascadesListWithoutPagination";
import { useMerchantsListWithoutPagination } from "@/hooks";

interface MerchantCascadeCreateProps {
    onOpenChange: (state: boolean) => void;
    merchantId?: string;
}

export const MerchantCascadeCreate = ({ onOpenChange, merchantId }: MerchantCascadeCreateProps) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController({ resource: "cascadeSettings/cascadeMerchants" });
    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const { merchantData, isMerchantsLoading } = useMerchantsListWithoutPagination();
    const { cascadesData, isCascadesLoading } = useCascadesListWithoutPagination();

    const [merchantName, setMerchantName] = useState("");
    const [cascadeName, setCascadeName] = useState("");

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        merchant: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim(),
        cascade: z.string().min(1, translate("resources.cascadeSettings.cascades.errors.name")).trim()
        // state: z.enum(CASCADE_STATE as [string, ...string[]]).default(CASCADE_STATE[0])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // state: CASCADE_STATE[0],
            cascade: "",
            merchant: ""
        }
    });

    useEffect(() => {
        if (merchantId && merchantData && merchantData.length > 0) {
            const preFoundMerchant = merchantData.find(item => item.id === merchantId);

            if (preFoundMerchant) {
                setMerchantName(preFoundMerchant.name);
                form.setValue("merchant", preFoundMerchant.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantData, merchantId]);

    const formMerchantId = form.watch("merchant");

    const cascadesFilteredData = useMemo(() => {
        if (cascadesData) {
            if (merchantData && formMerchantId) {
                const preFoundMerchant = merchantData.find(item => item.id === formMerchantId);

                return cascadesData.filter(cascade =>
                    preFoundMerchant?.allowed_src_currencies?.map(item => item.code).includes(cascade.src_currency.code)
                );
            } else {
                return cascadesData;
            }
        } else {
            return [];
        }
    }, [cascadesData, merchantData, formMerchantId]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await dataProvider.create("cascadeSettings/cascadeMerchants", {
                data: {
                    merchant_id: data.merchant,
                    cascade_id: data.cascade
                }
            });

            appToast("success", translate("app.ui.create.createSuccess"));
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already exists")) {
                    appToast("error", translate("resources.cascadeSettings.cascadeMerchants.errors.alreadyExist"));
                } else {
                    appToast("error", error.message);
                }
            } else {
                appToast("error", translate("app.ui.toast.error"));
            }
        } finally {
            setSubmitButtonDisabled(false);
            refresh();
        }
    };

    if (controllerProps.isLoading || isMerchantsLoading || isCascadesLoading || theme.length === 0)
        return (
            <div className="h-[250px]">
                <Loading />
            </div>
        );

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <>
                                            <Label>
                                                {translate(
                                                    "resources.cascadeSettings.cascadeMerchants.fields.merchant"
                                                )}
                                            </Label>

                                            <MerchantSelect
                                                merchants={merchantData || []}
                                                value={merchantName}
                                                onChange={val => {
                                                    if (cascadeName || form.getValues("cascade")) {
                                                        setCascadeName("");
                                                        form.setValue("cascade", "");
                                                    }

                                                    setMerchantName(val);
                                                }}
                                                setIdValue={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                                disabled={isMerchantsLoading}
                                                isLoading={isMerchantsLoading}
                                                modal
                                            />
                                        </>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cascade"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <>
                                            <Label>
                                                {translate("resources.cascadeSettings.cascadeMerchants.fields.cascade")}
                                            </Label>
                                            <CascadeSelect
                                                cascades={cascadesFilteredData}
                                                value={cascadeName}
                                                onChange={setCascadeName}
                                                setIdValue={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                                disabled={isCascadesLoading}
                                                isLoading={isCascadesLoading}
                                                modal
                                            />
                                        </>
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
                            onClick={() => onOpenChange(false)}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
