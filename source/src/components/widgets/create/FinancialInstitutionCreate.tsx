import { useCreateController, CreateContextProvider, useTranslate, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { FinancialInstitutionCreate as IFinancialInstitutionCreate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { useGetPaymentTypes } from "@/hooks/useGetPaymentTypes";
import { PaymentTypeMultiSelect } from "../components/PaymentTypeMultiSelect";
import { FinancialInstitutionProvider, FinancialInstitutionTypes } from "@/data/financialInstitution";

export interface PaymentTypeCreateProps {
    onClose?: () => void;
}

export const FinancialInstitutionCreate = ({ onClose = () => {} }: PaymentTypeCreateProps) => {
    const financialInstitutionProvider = new FinancialInstitutionProvider();
    const controllerProps = useCreateController<IFinancialInstitutionCreate>();

    const { theme } = useTheme();
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const { allPaymentTypes, isLoadingAllPaymentTypes } = useGetPaymentTypes({});

    const [hasErrors, setHasErrors] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.paymentTools.financialInstitution.errors.name")).trim(),
        short_name: z.string().trim().optional(),
        legal_name: z.string().trim().optional(),
        tax_id_number: z.string().trim().optional(),
        registration_number: z.string().trim().optional(),
        nspk_member_id: z.string().trim().optional(),
        bic: z.string().trim().optional(),
        institution_type: z.enum([FinancialInstitutionTypes.BANK, FinancialInstitutionTypes.OTHER]),
        country_code: z
            .string()
            .regex(/^\w{2}$/, translate("resources.paymentTools.financialInstitution.errors.country_code"))
            .trim(),
        payment_types: z.array(z.string()).optional(),
        meta: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country_code: "",
            short_name: "",
            legal_name: "",
            tax_id_number: "",
            registration_number: "",
            nspk_member_id: "",
            bic: "",
            institution_type: FinancialInstitutionTypes.BANK,
            payment_types: [],
            meta: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        let payment_types: string[] = [];
        setSubmitButtonDisabled(true);

        if (data.payment_types) {
            payment_types = [...data.payment_types];
            delete data.payment_types;
        }

        console.log(data);

        try {
            const { data: financialInstitutionData } = await financialInstitutionProvider.create(
                "financialInstitution",
                {
                    data: { ...data, meta: data.meta && data.meta.length !== 0 ? JSON.parse(data.meta) : {} }
                }
            );

            if (payment_types.length > 0) {
                await financialInstitutionProvider.addPaymentTypes({
                    id: financialInstitutionData.id,
                    data: {
                        codes: payment_types
                    },
                    previousData: undefined
                });
            }

            appToast("success", translate("app.ui.create.createSuccess"));

            refresh();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            } else {
                appToast("error", translate("app.ui.create.createError"));
            }
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (controllerProps.isLoading || isLoadingAllPaymentTypes || theme.length === 0) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.name"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="short_name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.short_name"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="legal_name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            label={translate(
                                                "resources.paymentTools.financialInstitution.fields.legal_name"
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="tax_id_number"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.tax_id_number"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="registration_number"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.registration_number"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="nspk_member_id"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.nspk_member_id"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country_code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.country_code"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bic"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate(
                                                    "resources.paymentTools.financialInstitution.fields.bic"
                                                )}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="institution_type"
                                render={({ field, fieldState }) => {
                                    return (
                                        <FormItem className="w-full p-2">
                                            <Label>
                                                {translate(
                                                    "resources.paymentTools.financialInstitution.fields.institution_type"
                                                )}
                                            </Label>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger
                                                        variant={SelectType.GRAY}
                                                        isError={fieldState.invalid}
                                                        errorMessage={<FormMessage />}>
                                                        <SelectValue
                                                            placeholder={translate("resources.direction.fields.active")}
                                                            defaultValue={FinancialInstitutionTypes.BANK}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.keys(FinancialInstitutionTypes).map(type => (
                                                            <SelectItem
                                                                key={type}
                                                                value={type}
                                                                variant={SelectType.GRAY}>
                                                                {translate(
                                                                    `resources.paymentTools.financialInstitution.fields.types.${type}`
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    );
                                }}
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

                        <FormField
                            control={form.control}
                            name="meta"
                            render={({ field }) => {
                                return (
                                    <FormItem className="w-full p-2">
                                        <FormLabel>
                                            <span className="!text-note-1 !text-neutral-30">
                                                {translate("resources.paymentTools.financialInstitution.fields.meta")}
                                            </span>
                                        </FormLabel>

                                        <FormControl>
                                            <MonacoEditor
                                                onErrorsChange={setHasErrors}
                                                onMountEditor={() => setMonacoEditorMounted(true)}
                                                code={field.value || "{}"}
                                                setCode={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={hasErrors || !monacoEditorMounted || submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline_gray"
                                className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                                onClick={onClose}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
