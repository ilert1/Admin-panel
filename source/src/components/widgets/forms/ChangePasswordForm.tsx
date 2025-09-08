import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Loading } from "@/components/ui/loading";
import { Rule } from "@/components/ui/rule";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { UsersDataProvider } from "@/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuthProvider, useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
interface ChangePasswordFormProps {
    onOpenChange: (state: boolean) => void;
}
export const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const translate = useTranslate();
    const { onOpenChange } = props;
    const authProvider = useAuthProvider();
    const [userId, setUserId] = useState("");

    const [isPasswordLengthError, setIsPasswordLenghtError] = useState<boolean | undefined>(undefined);
    const [isPasswordUppercaseError, setIsPasswordUppercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordLowercaseError, setIsPasswordLowercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordDigitError, setIsPasswordDigitError] = useState<boolean | undefined>(undefined);
    const [isPasswordEnglishOnlyError, setIsPasswordEnglishOnlyError] = useState<boolean | undefined>(undefined);
    const appToast = useAppToast();

    const onSubmit: SubmitHandler<Users.PasswordChange> = async formData => {
        try {
            const { currentPassword, newPassword } = formData;

            await UsersDataProvider.updatePassword("users", {
                id: userId,
                previousData: undefined,
                data: {
                    current_password: currentPassword,
                    new_password: newPassword
                }
            });
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        }
    };

    const formSchema = z
        .object({
            currentPassword: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")),
            newPassword: z
                .string()
                .min(1, translate("pages.settings.passChange.errors.cantBeEmpty"))
                .refine(password => password.length > 9, {
                    message: translate("pages.settings.passChange.errors.lenght"),
                    path: ["passwordLenghtError"]
                })
                .refine(password => /^[a-zA-Z0-9!@#$%^&*()_+\-=<>?/{}[\]\\|.,:;"'~`]+$/.test(password), {
                    path: ["passwordLetterError"]
                })
                .refine(password => /[A-Z]/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneUppercase"),
                    path: ["passwordUppercaseError"]
                })
                .refine(password => /[a-z]/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneLowercase"),
                    path: ["passwordLowercaseError"]
                })
                .refine(password => /\d/.test(password), {
                    message: translate("pages.settings.passChange.errors.oneDigit"),
                    path: ["passwordDigitError"]
                }),

            newPasswordRepeat: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty"))
        })
        .refine(
            data => data.newPassword === data.newPasswordRepeat,
            () => {
                return {
                    message: translate("pages.settings.passChange.errors.dontMatch"),
                    path: ["newPasswordRepeat"]
                };
            }
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            newPasswordRepeat: ""
        },
        mode: "all"
    });

    const { errors } = form.formState;
    const val = form.watch("newPassword");

    const { currentPassword, newPassword, newPasswordRepeat } = form.getValues();
    const hasErrors = Object.keys(errors).length > 0;
    const isFormIncomplete = !currentPassword || !newPassword || !newPasswordRepeat;

    const isAnyPasswordError = [
        isPasswordLengthError,
        isPasswordDigitError,
        isPasswordUppercaseError,
        isPasswordLowercaseError
    ].some(error => error !== false);

    useEffect(() => {
        async function checkAuth() {
            if (authProvider?.getIdentity) {
                const data = await authProvider?.getIdentity();
                setUserId(String(data.id));
            }
        }
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const errorStates = {
            passwordDigitError: setIsPasswordDigitError,
            passwordLetterError: setIsPasswordEnglishOnlyError,
            passwordLowercaseError: setIsPasswordLowercaseError,
            passwordUppercaseError: setIsPasswordUppercaseError,
            passwordLenghtError: setIsPasswordLenghtError
        };

        if (Object.keys(errors).length > 0 || isPasswordLengthError === undefined) {
            if (Object.hasOwn(errors, "newPassword")) {
                Object.entries(errorStates).forEach(([errorKey, setState]) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setState(Object.hasOwn(errors?.newPassword, errorKey));
                });
                if (val.length === 0) {
                    setIsPasswordEnglishOnlyError(false);
                }
            } else {
                if (val.length) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    Object.entries(errorStates).forEach(([_, setState]) => {
                        setState(false);
                    });
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(errorStates).forEach(([_, setState]) => {
                setState(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors.newPassword, val]);

    useEffect(() => {
        const subscription = form.watch(() => {
            const { newPassword, newPasswordRepeat } = form.getValues();
            if (newPassword.length > 0 && newPasswordRepeat.length > 0) {
                form.trigger("newPasswordRepeat");
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    if (!userId) {
        return <Loading />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6" autoComplete="off">
                <div className="flex w-full flex-col gap-[20px]">
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
                                        type="password_masked"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        className="text-sm"
                                        variant={InputTypes.GRAY}
                                        label={translate("pages.settings.passChange.newPassword")}
                                        error={isPasswordEnglishOnlyError}
                                        errorMessage={
                                            isPasswordEnglishOnlyError &&
                                            translate("pages.settings.passChange.errors.onlyEnglishLetters")
                                        }
                                        type="password_masked"
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
                                        type="password_masked"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 justify-between gap-x-[15px] gap-y-[4px] sm:grid-cols-2">
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
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:self-end">
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full sm:w-auto"
                        disabled={hasErrors || isAnyPasswordError || isFormIncomplete}>
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
        </Form>
    );
};
