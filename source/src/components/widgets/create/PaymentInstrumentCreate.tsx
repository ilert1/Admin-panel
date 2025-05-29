import {
    DirectionType,
    SystemPaymentInstrumentCreate,
    SystemPaymentInstrumentStatus
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button } from "@/components/ui/Button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/label";
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
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { PaymentTypeWithId } from "@/data/payment_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface PaymentInstrumentCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const PaymentInstrumentCreate = (props: PaymentInstrumentCreateProps) => {
    const { onOpenChange } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const appToast = useAppToast();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery({
        queryKey: ["paymentTypes"],
        queryFn: () => dataProvider.getListWithoutPagination("payment_type"),
        select: data => data.data
    });

    console.log(paymentTypes);

    const onSubmit: SubmitHandler<SystemPaymentInstrumentCreate> = async data => {
        if (buttonDisabled) return;
        setButtonDisabled(true);
        try {
            await dataProvider.create("systemPaymentInstruments", { data: data });

            appToast(
                "success",
                translate("resources.paymentTools.systemPaymentInstruments.createSuccess"),
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
            else
                appToast(
                    "error",
                    translate("resources.paymentTools.systemPaymentInstruments.errors.errorWhenCreating")
                );
            setButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        payment_type_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        currency_code: z
            .string()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        financial_institution_id: z
            .string()
            .uuid()
            .min(1, translate("resources.paymentTools.systemPaymentInstruments.errors.cantBeEmpty")),
        direction: z.enum(Object.keys(DirectionType) as [string, ...string[]]).default("universal"),
        status: z.enum(Object.keys(SystemPaymentInstrumentStatus) as [string, ...string[]]).default("active"),
        description: z.string().optional(),
        // meta	:Additional metadata in JSON format, useful for custom configurations or notes.
        meta: z.object({}).optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            payment_type_code: "",
            currency_code: "",
            financial_institution_id: "",
            direction: "",
            status: "",
            description: "",
            meta: {}
        }
    });
    if (paymentTypesLoading)
        return (
            <div className="h-[300px]">
                <Loading />
            </div>
        );

    const paymentsDisabled = !paymentTypes || paymentTypes.length === 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.callbridge.mapping.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="payment_type_code"
                        render={({ field, fieldState }) => (
                            <FormItem className="w-full p-2 sm:w-1/2">
                                <Label>AAA</Label>
                                <Select value={field.value} onValueChange={field.onChange} disabled={paymentsDisabled}>
                                    <FormControl>
                                        <SelectTrigger
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue
                                                placeholder={
                                                    paymentsDisabled ? translate("resources.direction.noTerminals") : ""
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {!paymentsDisabled
                                                ? paymentTypes.map((paymentType: PaymentTypeWithId) => (
                                                      <SelectItem
                                                          key={paymentType.code}
                                                          value={paymentType.code}
                                                          variant={SelectType.GRAY}>
                                                          {paymentType.code}
                                                      </SelectItem>
                                                  ))
                                                : ""}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="external_path"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        variant={InputTypes.GRAY}
                                        label={translate("resources.callbridge.mapping.fields.int_path")}
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
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        label={translate("resources.callbridge.mapping.fields.description")}
                                        variant={InputTypes.GRAY}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                    <Button type="submit" variant="default" className="w-full sm:w-auto">
                        {translate("app.ui.actions.save")}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline_gray"
                        type="button"
                        className="w-full rounded-4 border border-neutral-50 hover:border-neutral-100 sm:w-auto">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
