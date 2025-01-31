import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Loading } from "@/components/ui/loading";
import { Rule } from "@/components/ui/rule";
import { UsersDataProvider } from "@/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuthProvider, useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
interface ChangePasswordFormProps {
    onOpenChange: (state: boolean) => void;
}
export const ChangePasswordForm = (props: ChangePasswordFormProps) => {
    const translate = useTranslate();
    const { onOpenChange } = props;
    const usersDataProvider = new UsersDataProvider();
    const { getIdentity } = useAuthProvider();
    const [userId, setUserId] = useState("");

    const [isPasswordLengthError, setIsPasswordLenghtError] = useState<boolean | undefined>(undefined);
    const [isPasswordUppercaseError, setIsPasswordUppercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordLowercaseError, setIsPasswordLowercaseError] = useState<boolean | undefined>(undefined);
    const [isPasswordDigitError, setIsPasswordDigitError] = useState<boolean | undefined>(undefined);
    const [isPasswordEnglishOnlyError, setIsPasswordEnglishOnlyError] = useState<boolean | undefined>(undefined);
    // usersDataProvider.updatePassword()
    const onSubmit: SubmitHandler<Users.PasswordChange> = async formData => {
        try {
            const { currentPassword, newPassword } = formData;

            const { status, success } = await usersDataProvider.updatePassword("users", {
                id: userId,
                previousData: undefined,
                data: {
                    current_password: currentPassword,
                    new_password: newPassword
                }
            });
        } catch (error) {
            toast("Error", {
                dismissible: true,
                duration: 300,
                description: ""
            });
        }
    };

    const formSchema = z
        .object({
            currentPassword: z.string().min(1, translate("pages.settings.passChange.errors.cantBeEmpty")),
            newPassword: z
                .string()
                .min(1, translate("pages.settings.passChange.errors.cantBeEmpty"))
                .refine(password => /^[a-zA-Z0-9!@#$%^&*()_+\-=<>?/{}[\]\\|.,:;"'~`]+$/.test(password), {
                    path: ["onlyEnglishLetters"]
                })
                .refine(password => password.length > 9, {
                    message: translate("pages.settings.passChange.errors.lenght"),
                    path: ["passwordLenghtError"]
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
            if (getIdentity) {
                const data = await getIdentity();
                setUserId(String(data.id));
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        const errorStates = {
            passwordDigitError: setIsPasswordDigitError,
            onlyEnglishLetters: setIsPasswordEnglishOnlyError,
            passwordLowercaseError: setIsPasswordLowercaseError,
            passwordUppercaseError: setIsPasswordUppercaseError,
            passwordLenghtError: setIsPasswordLenghtError
        };

        if (Object.keys(errors).length > 0 || isPasswordLengthError === undefined) {
            if (Object.hasOwn(errors, "newPassword")) {
                Object.entries(errorStates).forEach(([errorKey, setState]) => {
                    if (errorKey === "onlyEnglishLetters") {
                        setIsPasswordEnglishOnlyError(true);
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setState(Object.hasOwn(errors?.newPassword, errorKey));
                });
            } else {
                if (val.length) {
                    Object.entries(errorStates).forEach(([_, setState]) => {
                        setState(false);
                    });
                }
            }
        } else {
            Object.entries(errorStates).forEach(([_, setState]) => {
                setState(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors.newPassword, val]);

    if (!userId) {
        return <Loading />;
    }

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
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        className="text-sm"
                                        variant={InputTypes.GRAY}
                                        label={translate("pages.settings.passChange.newPassword")}
                                        error={fieldState.invalid}
                                        errorMessage={
                                            isPasswordEnglishOnlyError
                                                ? translate("pages.settings.passChange.errors.onlyEnglishLetters")
                                                : null
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
                        className="border border-neutral-50 rounded-4 hover:border-neutral-100 w-full sm:w-auto">
                        {translate("app.ui.actions.cancel")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
