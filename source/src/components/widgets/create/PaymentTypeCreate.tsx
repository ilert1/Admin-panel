import { useCreateController, CreateContextProvider, useTranslate, useDataProvider } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/ui/loading";
import { useTheme } from "@/components/providers";
import {
    PaymentTypeCreate as IPaymentTypeCreate,
    PaymentCategory
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { Label } from "@/components/ui/label";
import {
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
    Select,
    SelectType,
    SelectItem
} from "@/components/ui/select";
import { Trash, X } from "lucide-react";

export interface PaymentTypeCreateProps {
    onClose?: () => void;
}

export const PaymentTypeCreate = ({ onClose = () => {} }: PaymentTypeCreateProps) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController<IPaymentTypeCreate>();
    const { theme } = useTheme();
    const appToast = useAppToast();
    const translate = useTranslate();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [iconFileName, setIconFileName] = useState<string>("");
    const paymentTypeCategories = Object.keys(PaymentCategory);

    const formSchema = z.object({
        code: z
            .string()
            .min(1, translate("resources.paymentTools.paymentType.errors.code"))
            .regex(/^[A-Za-z0-9_-]+$/, translate("resources.paymentTools.paymentType.errors.codeRegex"))
            .trim(),
        title: z.string().optional().default(""),
        category: z.enum(paymentTypeCategories as [string, ...string[]]).default("h2h"),
        meta: z
            .object({
                icon: z.string().optional()
            })
            .optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            title: "",
            category: paymentTypeCategories[0],
            meta: {
                icon: ""
            }
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        try {
            await dataProvider.create("payment_type", { data });
            appToast("success", translate("app.ui.create.createSuccess"));
        } catch (error) {
            // С бэка прилетает нечеловеческая ошибка, поэтому оставлю пока так
            // if (error instanceof Error) {
            //     appToast("error", error.message);
            // }
            console.log();

            appToast("error", translate("resources.paymentTools.paymentType.duplicateCode"));
            setSubmitButtonDisabled(false);
        } finally {
            onClose();
        }
    };

    if (controllerProps.isLoading || theme.length === 0) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
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
                            <FormField
                                control={form.control}
                                name="meta.icon"
                                render={({ field }) => (
                                    <FormItem className="w-full p-2">
                                        <Label>{translate("resources.paymentTools.paymentType.fields.icon")}</Label>
                                        <div className="!mt-0 flex items-center gap-4">
                                            {field.value && (
                                                <div className="h-10 w-10">
                                                    <img
                                                        src={field.value}
                                                        alt="icon"
                                                        className="pointer-events-none h-full w-full object-contain"
                                                    />
                                                </div>
                                            )}

                                            <div className="relative w-full">
                                                <label
                                                    htmlFor="icon-upload"
                                                    className="block w-full cursor-pointer rounded-4 bg-green-50 px-4 py-2 text-center !text-white transition-all duration-300 hover:bg-green-40"
                                                    title={
                                                        iconFileName ||
                                                        translate("resources.paymentTools.paymentType.uploadIcon") +
                                                            "..."
                                                    }>
                                                    <span className="block truncate">
                                                        {iconFileName ||
                                                            translate("resources.paymentTools.paymentType.uploadIcon") +
                                                                "..."}
                                                    </span>
                                                </label>

                                                {iconFileName && (
                                                    <X
                                                        size={20}
                                                        className="absolute right-2 top-2 cursor-pointer text-white"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setIconFileName("");
                                                            form.setValue("meta.icon", "", { shouldValidate: true });
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <input
                                                id="icon-upload"
                                                type="file"
                                                accept=".svg"
                                                style={{ display: "none" }}
                                                onChange={async e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setIconFileName(file.name);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string;
                                                            form.setValue("meta.icon", base64, {
                                                                shouldValidate: true
                                                            });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
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
        </CreateContextProvider>
    );
};
