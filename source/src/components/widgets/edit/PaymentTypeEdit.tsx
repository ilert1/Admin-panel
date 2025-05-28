import { useTranslate, useDataProvider, useEditController, EditContextProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { usePreventFocus } from "@/hooks";
import { useRefresh } from "react-admin";
import {
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
    Select,
    SelectType,
    SelectItem
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentCategory } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

export interface PaymentTypeEditProps {
    id: string;
    onClose?: () => void;
}

export const PaymentTypeEdit = ({ id, onClose = () => {} }: PaymentTypeEditProps) => {
    const dataProvider = useDataProvider();
    const controllerProps = useEditController({ resource: "payment_type", id });
    const { theme } = useTheme();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const translate = useTranslate();
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const paymentTypeCategories = Object.keys(PaymentCategory);

    const formSchema = z.object({
        code: z.string().min(1, translate("resources.paymentTools.paymentType.errors.code")).trim(),
        title: z.string().optional().default(""),
        category: z.enum(paymentTypeCategories as [string, ...string[]])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: id,
            title: controllerProps.record?.title,
            category: controllerProps.record?.category
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await dataProvider.update("payment_type", {
                id,
                data,
                previousData: undefined
            });

            appToast("success", translate("app.ui.edit.editSuccess"));
            refresh();
            onClose();
        } catch (error) {
            // С бэка прилетает нечеловеческая ошибка, поэтому оставлю пока так
            // if (error instanceof Error) {
            //     appToast("error", error.message);
            // }

            appToast("error", translate("resources.paymentTools.paymentType.duplicateCode"));

            setSubmitButtonDisabled(false);
        }
    };

    usePreventFocus({});

    if (controllerProps.isLoading || theme.length === 0) return <Loading />;

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="flex flex-col flex-wrap">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.paymentTools.paymentType.fields.code")}
                                                disabled
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                variant={InputTypes.GRAY}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                label={translate("resources.paymentTools.paymentType.fields.title")}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field, fieldState }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>{translate("resources.paymentTools.paymentType.fields.category")}</Label>
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
                                                    {paymentTypeCategories.map(category => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                            variant={SelectType.GRAY}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full sm:w-1/2"
                                disabled={submitButtonDisabled}>
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
        </EditContextProvider>
    );
};
