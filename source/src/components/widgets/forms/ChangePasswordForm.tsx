import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Rule } from "@/components/ui/rule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
interface ChangePasswordFormProps {
    onOpenChange: (state: boolean) => void;
}
export const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const translate = useTranslate();
    const { onOpenChange } = props;

    const [isPasswordLengthError, setIsPasswordLenghtError] = useState<boolean | undefined>(undefined);
    const [isPasswordUppercaseError, setIsPasswordUppercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordLowercaseError, setIsPasswordLowercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordDigitError, setIsPasswordDigitError] = useState<boolean | undefined>(undefined);

    const formSchema = z
        .object({
            currentPassword: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")),
            newPassword: z
                .string()
                .min(1, translate("pages.settings.passChange.errors.cantBeEmpty"))
                .refine(password => password.length > 10, {
                    message: translate("pages.settings.passChange.errors.lenght"),
                    path: ["newPassword", "passwordLenghtError"]
                })
                .refine(password => /[A-Z]/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneUppercase"),
                    path: ["newPassword", "passwordUppercaseError"]
                })
                .refine(password => /[a-z]/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneLowercase"),
                    path: ["newPassword", "passwordLowercaseError"]
                })
                .refine(password => /\d/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneDigit"),
                    path: ["newPassword", "passwordDigitError"]
                }),
            newPasswordRepeat: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty"))
        })
        .refine(data => data.newPassword === data.newPasswordRepeat, {
            message: translate("pages.settings.passChange.errors.dontMatch"),
            path: ["newPasswordRepeat"]
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordRepeat: ""
        },
        mode: "onChange"
    });

    const onSubmit: SubmitHandler<Users.PasswordChange> = async data => {};
    const { errors } = form.formState;

    useEffect(() => {
        const errorStates = {
            passwordDigitError: setIsPasswordDigitError,
            passwordLowercaseError: setIsPasswordLowercaseError,
            passwordUppercaseError: setIsPasswordUppercaseError,
            passwordLenghtError: setIsPasswordLenghtError
        };
        if (Object.keys(errors).length > 0) {
            console.log(errors.newPassword);
            if (Object.hasOwn(errors, "newPassword")) {
                Object.entries(errorStates).forEach(([errorKey, setState]) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setState(Object.hasOwn(errors?.newPassword?.newPassword, errorKey));
                });
            } else {
                console.log("falsing");

                Object.entries(errorStates).forEach(([_, setState]) => {
                    setState(false);
                });
            }
        }
    }, [errors]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full" autoComplete="off">
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
                                        autoComplete="new-password"
                                        readOnly
                                        {...field}
                                        autoCorrect="off"
                                        spellCheck="false"
                                        autoCapitalize="none"
                                        ref={input => {
                                            if (input) {
                                                input.removeAttribute("readonly");
                                            }
                                        }}
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
                                        errorMessage={translate("pages.settings.passChange.errors.wrongFormat")}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[4px] gap-x-[15px] justify-between">
                        <Rule
                            text={translate("pages.settings.passChange.rules.notLessThanTenSymbols")}
                            isError={isPasswordLengthError}
                        />
                        <Rule
                            text={translate("pages.settings.passChange.rules.notLessThanOneDigit")}
                            isError={isPasswordDigitError}
                        />
                        <Rule
                            text={translate("pages.settings.passChange.rules.notLessThanOneCapital")}
                            isError={isPasswordUppercaseError}
                        />
                        <Rule
                            text={translate("pages.settings.passChange.rules.notLessThanOneLowercase")}
                            isError={isPasswordLowercaseError}
                        />
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
