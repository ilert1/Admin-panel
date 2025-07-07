import { CreateContextProvider, useCreateController, useRefresh, useTranslate } from "react-admin";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import clsx from "clsx";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useSheets } from "@/components/providers/SheetProvider";
import { UsersDataProvider } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { MerchantSelect } from "../components/Selects/MerchantSelect";
import { useFetchMerchants } from "@/hooks";

interface UserCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const UserCreate = ({ onOpenChange }: UserCreateProps) => {
    const contrProps = useCreateController();
    const translate = useTranslate();
    const refresh = useRefresh();
    const { openSheet } = useSheets();
    const appToast = useAppToast();
    const { merchantData, merchantsLoadingProcess } = useFetchMerchants();
    const usersDataProvider = UsersDataProvider;

    const [merchantName, setMerchantName] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [disabledMerchantField, setDisabledMerchantField] = useState(false);

    const isFirefox = useMemo(() => navigator.userAgent.match(/firefox|fxios/i), []);

    const { data: userRoles } = useQuery({
        queryKey: ["userRoles"],
        queryFn: async ({ signal }) => {
            try {
                const d = await usersDataProvider.getRoles({ signal });
                return d;
            } catch (error) {
                if (error instanceof Error) {
                    appToast("error", error.message);
                }
            }
        }
    });

    const formSchema = z.object({
        first_name: z
            .string()
            .regex(/^[a-zA-Zа-яА-Я:'\-.,_@+]{0,255}$/, translate("app.widgets.forms.userCreate.firstNameMessage"))
            .trim(),
        last_name: z
            .string()
            .regex(/^[a-zA-Zа-яА-Я:'\-.,_@+]{0,255}$/, translate("app.widgets.forms.userCreate.lastNameMessage"))
            .trim(),
        login: z
            .string()
            .regex(/^[a-zA-Z\-_.@1-9]{3,255}$/, translate("app.widgets.forms.userCreate.loginMessage"))
            .trim(),
        email: z
            .union([
                z.string().length(0, translate("app.widgets.forms.userCreate.emailMessage")),
                z
                    .string()
                    .regex(
                        /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/,
                        translate("app.widgets.forms.userCreate.emailMessage")
                    )
                    .trim()
            ])
            .optional(),
        password: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[!@#$%^&*()-_])[a-zA-Zа-яА-Я0-9!@#$%^&*()-_]{8,20}$/,
                translate("app.widgets.forms.userCreate.passwordMessage")
            ),
        role_name: z.string().min(1).trim(),
        merchant_id: z
            .string()
            .refine(input => {
                if (disabledMerchantField || input.length > 0) {
                    return true;
                }

                return false;
            })
            .optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            login: "",
            email: "",
            password: "",
            role_name: "merchant",
            merchant_id: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        const tempData = { ...data };

        if (disabledMerchantField) {
            delete tempData.merchant_id;
        }

        try {
            const res = await usersDataProvider.create(`users`, { data: tempData });

            appToast(
                "success",
                <span>
                    {translate("resources.users.create.successMessage", { name: data.login })}
                    <Button
                        className="!pl-1"
                        variant="resourceLink"
                        onClick={() => openSheet("user", { id: res.data.id })}>
                        {translate("app.ui.actions.details")}
                    </Button>
                </span>,
                translate("app.ui.toast.success"),
                10000
            );

            refresh();
            onOpenChange(false);
        } catch (error) {
            let message = "";
            if (error instanceof Error) {
                if (error.message.indexOf("failed get account") >= 0) {
                    message = translate("resources.users.create.merhchantDoesntExist");
                } else if (error.message.indexOf("409 Conflict") >= 0) {
                    if (error.message.indexOf("username") >= 0) {
                        message = translate("resources.users.create.usernameInUse");
                    } else {
                        message = translate("resources.users.create.emailInUse");
                    }
                } else if (error.message.indexOf("404 Not Found") >= 0) {
                    message = translate("resources.users.create.wrongRole");
                } else if (error.message.indexOf("400 Bad Request") >= 0) {
                    message = translate("resources.users.create.wrongNames");
                }
            }

            appToast("error", message, translate("resources.users.create.errorMessage"));
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (contrProps.save !== undefined) {
        return (
            <CreateContextProvider value={contrProps}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
                        <div className="md:grid-template-rows-auto flex flex-col items-stretch gap-x-4 gap-y-5 md:grid md:grid-cols-2 md:items-baseline">
                            <FormField
                                name="first_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                label={translate("app.widgets.forms.userCreate.firstName")}
                                                autoComplete={isFirefox ? "new-password" : "off"}
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck="false"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={InputTypes.GRAY}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="last_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                label={translate("app.widgets.forms.userCreate.lastName")}
                                                autoComplete={isFirefox ? "new-password" : "off"}
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck="false"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                variant={InputTypes.GRAY}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="login"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                label={translate("app.widgets.forms.userCreate.login")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                autoComplete={isFirefox ? "new-password" : "off"}
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck="false"
                                                variant={InputTypes.GRAY}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                label={translate("app.widgets.forms.userCreate.email")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                spellCheck="false"
                                                autoCorrect="off"
                                                autoComplete={isFirefox ? "new-password" : "off"}
                                                autoCapitalize="none"
                                                variant={InputTypes.GRAY}
                                                {...field}
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
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                type="password_masked"
                                                label={translate("app.widgets.forms.userCreate.password")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                {...field}
                                                autoComplete="new-password"
                                                autoCorrect="off"
                                                spellCheck="false"
                                                autoCapitalize="none"
                                                variant={InputTypes.GRAY}
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
                                name="role_name"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>{translate("app.widgets.forms.userCreate.role")}</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={value => {
                                                    if (value === "admin") {
                                                        form.setValue("merchant_id", "");
                                                        setDisabledMerchantField(true);
                                                    } else {
                                                        setDisabledMerchantField(false);
                                                    }

                                                    field.onChange(value);
                                                }}
                                                value={field.value}>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="!dark:bg-muted">
                                                    <SelectGroup>
                                                        {userRoles?.map(role => (
                                                            <SelectItem
                                                                key={role.id}
                                                                value={role.name}
                                                                variant={SelectType.GRAY}>
                                                                {translate(
                                                                    `resources.users.roles.${role.name}`
                                                                ).includes(".")
                                                                    ? role.name
                                                                    : translate(`resources.users.roles.${role.name}`)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className={clsx("col-span-2", disabledMerchantField && "hidden")}>
                                <FormField
                                    control={form.control}
                                    name="merchant_id"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>{translate("app.widgets.forms.userCreate.merchant")}</FormLabel>
                                            <FormControl>
                                                <MerchantSelect
                                                    merchants={merchantData || []}
                                                    value={merchantName}
                                                    onChange={setMerchantName}
                                                    setIdValue={field.onChange}
                                                    isError={fieldState.invalid}
                                                    errorMessage={fieldState.error?.message}
                                                    disabled={merchantsLoadingProcess}
                                                    isLoading={merchantsLoadingProcess}
                                                    modal
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:self-end">
                            <Button type="submit" disabled={submitButtonDisabled}>
                                {translate("app.ui.actions.save")}
                            </Button>

                            <Button
                                type="button"
                                onClick={() => {
                                    onOpenChange(false);
                                }}
                                variant="outline_gray">
                                {translate("app.widgets.forms.userCreate.cancelBtn")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CreateContextProvider>
        );
    }
};
