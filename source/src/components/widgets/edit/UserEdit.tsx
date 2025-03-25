import { useTranslate, useDataProvider, useRefresh, fetchUtils } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormMessage, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { usePreventFocus } from "@/hooks";
import { Loading } from "@/components/ui/loading";
import { MerchantSelectFilter } from "../shared/MerchantSelectFilter";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface UserEditProps {
    id: string;
    record: Omit<Users.User, "created_at" | "deleted_at" | "id">;
    onOpenChange: (state: boolean) => void;
}

interface KecloakRoles {
    clientRole: boolean;
    composite: boolean;
    containerId: string;
    description: string;
    id: string;
    name: string;
}

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;

export const UserEdit = ({ id, record, onOpenChange }: UserEditProps) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const isFirefox = useMemo(() => navigator.userAgent.match(/firefox|fxios/i), []);

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [disabledMerchantField, setDisabledMerchantField] = useState(false);

    const { data: userRoles } = useQuery({
        queryKey: ["userRoles"],
        queryFn: async ({ signal }) => {
            const res = await fetchUtils.fetchJson(`${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles`, {
                user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` },
                signal
            });

            return res.json as KecloakRoles[];
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
            await dataProvider.update("users", {
                id,
                data: tempData,
                previousData: undefined
            });

            appToast("success", translate("resources.users.editSuccessMessage"));
            refresh();
            onOpenChange(false);
        } catch (error) {
            appToast("error", translate("resources.currency.errors.alreadyInUse"));
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        first_name: z.string().min(3, translate("app.widgets.forms.userCreate.firstNameMessage")).trim(),
        last_name: z.string().min(3, translate("app.widgets.forms.userCreate.lastNameMessage")).trim(),
        login: z.string().min(3, translate("app.widgets.forms.userCreate.loginMessage")).trim(),
        email: z
            .string()
            .regex(/^\S+@\S+\.\S+$/, translate("app.widgets.forms.userCreate.emailMessage"))
            .trim(),
        password: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[!@#$%^&*()-_])[a-zA-Z0-9!@#$%^&*()-_]{8,20}$/,
                translate("app.widgets.forms.userCreate.passwordMessage")
            ),
        activity: z.boolean(),
        role_name: z.string().min(1).trim(),
        merchant_id: z.string().trim().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: record?.first_name || "",
            last_name: record?.last_name || "",
            login: record?.login || "",
            email: record?.email || "",
            password: record?.password || "",
            role_name: record?.roles[0].name || "merchant",
            activity: record?.activity || true,
            merchant_id: record?.merchant_id || ""
        }
    });

    useEffect(() => {
        if (record) {
            form.reset({
                first_name: record?.first_name || "",
                last_name: record?.last_name || "",
                login: record?.login || "",
                email: record?.email || "",
                password: record?.password || "",
                role_name: "merchant",
                activity: record?.activity || true,
                merchant_id: record?.merchant_id || ""
            });
        }
    }, [form, record]);

    usePreventFocus({ dependencies: [record] });

    if (!record)
        return (
            <div className="h-[150px]">
                <Loading />
            </div>
        );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
                <div className="md:grid-template-rows-auto flex flex-col items-stretch gap-x-4 gap-y-5 md:grid md:grid-cols-2 md:items-baseline">
                    <Input
                        label={translate("app.widgets.forms.userCreate.id")}
                        disabled
                        value={id}
                        variant={InputTypes.GRAY}
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
                                        disabled
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
                        name="first_name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormControl>
                                    <Input
                                        label={translate("app.widgets.forms.userCreate.firstName")}
                                        autoComplete={isFirefox ? "new-password" : "off"}
                                        disabled
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
                                        disabled
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
                                        disabled
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
                        control={form.control}
                        name="role_name"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.role")}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={value => {
                                            if (value === "admin") {
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
                                                        {translate(`resources.users.roles.${role.name}`).includes(".")
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
                                        disabled
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
                        control={form.control}
                        name="activity"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.activity.name")}</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={val => field.onChange(val === "true" ? true : false)}
                                        value={field.value ? "true" : "false"}
                                        disabled>
                                        <SelectTrigger
                                            variant={SelectType.GRAY}
                                            isError={fieldState.invalid}
                                            errorMessage={<FormMessage />}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="!dark:bg-muted">
                                            <SelectGroup>
                                                <SelectItem value={"true"} variant={SelectType.GRAY}>
                                                    {translate("app.widgets.forms.userCreate.activity.active")}
                                                </SelectItem>
                                                <SelectItem value={"false"} variant={SelectType.GRAY}>
                                                    {translate("app.widgets.forms.userCreate.activity.blocked")}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="merchant_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>{translate("app.widgets.forms.userCreate.merchant")}</FormLabel>
                                    <FormControl>
                                        <MerchantSelectFilter
                                            variant="outline"
                                            disabled={disabledMerchantField}
                                            error={fieldState.error?.message}
                                            merchant={field.value || ""}
                                            onMerchantChanged={field.onChange}
                                            resource="merchant"
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
                        onClick={() => onOpenChange(false)}
                        variant="outline_gray"
                        className="rounded-4 border border-neutral-50 hover:border-neutral-100">
                        {translate("app.widgets.forms.userCreate.cancelBtn")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
