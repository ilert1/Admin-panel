import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Rule } from "@/components/ui/rule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
interface ChangePasswordFormProps {
    onOpenChange: (state: boolean) => void;
}
export const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const translate = useTranslate();
    const { onOpenChange } = props;

    const formSchema = z
        .object({
            currentPassword: z.string().min(1),
            newPassword: z
                .string()
                .min(10, translate("pages.settings.passChange.errors.lenght"))
                .refine(password => /[A-Z]/.test(password), translate("pages.settings.passChange.errors.oneUppercase"))
                .refine(password => /[a-z]/.test(password), translate("pages.settings.passChange.errors.oneLowercase"))
                .refine(password => /\d/.test(password), translate("pages.settings.passChange.errors.oneDigit")),
            newPasswordRepeat: z.string()
        })
        .refine(data => data.newPassword === data.newPasswordRepeat, {
            message: "",
            path: ["newPasswordRepeat"]
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordRepeat: ""
        }
    });

    const onSubmit: SubmitHandler<Users.PasswordChange> = async data => {
        const result = formSchema.safeParse(data);
        console.log(result);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                <div className="flex flex-col w-full gap-[20px]">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        className="text-sm"
                                        variant={InputTypes.GRAY}
                                        label={translate("pages.settings.passChange.currentPassowrd")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        className="text-sm"
                                        variant={InputTypes.GRAY}
                                        label={translate("pages.settings.passChange.newPassword")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPasswordRepeat"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        className="text-sm"
                                        variant={InputTypes.GRAY}
                                        label={translate("pages.settings.passChange.repeatNewPassword")}
                                        error={fieldState.invalid}
                                        errorMessage={<FormMessage />}
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-y-[4px] gap-x-[15px] justify-between">
                        <Rule text={translate("pages.settings.passChange.rules.notLessThanTenSymbols")} />
                        <Rule text={translate("pages.settings.passChange.rules.notLessThanOneDigit")} />
                        <Rule text={translate("pages.settings.passChange.rules.notLessThanOneCapital")} />
                        <Rule text={translate("pages.settings.passChange.rules.notLessThanOneLowercase")} />
                    </div>
                </div>
                <div className="flex flex-col sm:self-end sm:flex-row items-center gap-4">
                    <Button type="submit" variant="default" className="w-full sm:w-auto">
                        {translate("app.ui.actions.save")}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline_gray"
                        type="button"
                        className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full sm:w-auto">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
