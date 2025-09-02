import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectType,
//     SelectValue
// } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { CascadesDataProvider, MerchantsDataProvider } from "@/data";
import { MerchantSelect } from "../components/Selects/MerchantSelect";
import { CascadeSelect } from "../components/Selects/CascadeSelect";

// const CASCADE_STATE = ["active", "inactive", "archived"];

interface MerchantCascadeCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const MerchantCascadeCreate = (props: MerchantCascadeCreateProps) => {
    const { onOpenChange } = props;
    const dataProvider = useDataProvider();
    const merchantsDataProvider = new MerchantsDataProvider();
    const cascadesDataProvider = new CascadesDataProvider();
    const controllerProps = useCreateController({ resource: "cascadeSettings/cascadeMerchants" });
    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [merchantName, setMerchantName] = useState("");
    const [cascadeName, setCascadeName] = useState("");

    const { data: merchants, isLoading: isLoadingMerchants } = useQuery({
        queryKey: ["merchants_list"],
        queryFn: async ({ signal }) => await merchantsDataProvider.getListWithoutPagination("", signal)
    });

    const { data: cascades, isLoading: isCascadesLoading } = useQuery({
        queryKey: ["cascades_list"],
        queryFn: async ({ signal }) =>
            await cascadesDataProvider.getList("", { pagination: { page: 1, perPage: 100000 }, signal })
    });

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
                    appToast("error", translate("resources.cascadeSettings.cascades.errors.alreadyExist"));
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

    if (controllerProps.isLoading || isLoadingMerchants || isCascadesLoading || theme.length === 0)
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
                                                merchants={merchants?.data || []}
                                                value={merchantName}
                                                onChange={setMerchantName}
                                                setIdValue={field.onChange}
                                                isError={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                                disabled={isLoadingMerchants}
                                                isLoading={isLoadingMerchants}
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
                                                cascades={cascades?.data || []}
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
                        {/* <FormField
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
                        /> */}
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
