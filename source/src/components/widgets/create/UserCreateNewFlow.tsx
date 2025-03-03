import { toast } from "sonner";
import {
    CreateContextProvider,
    fetchUtils,
    useCreateController,
    useDataProvider,
    useRefresh,
    useTranslate
} from "react-admin";
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
import { MerchantSelectFilter } from "../shared/MerchantSelectFilter";
import { useQuery } from "react-query";

interface UserCreateProps {
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

export const UserCreateNewFlow = ({ onOpenChange }: UserCreateProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const contrProps = useCreateController();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const isFirefox = useMemo(() => navigator.userAgent.match(/firefox|fxios/i), []);

    const { data: userRoles } = useQuery(["userRoles"], async () => {
        const res = await fetchUtils.fetchJson(`${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles`, {
            user: { authenticated: true, token: `Bearer ${localStorage.getItem("access-token")}` }
        });

        return res.json as KecloakRoles[];
    });

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
        role_name: z.enum(["merchant"]),
        merchant_id: z.string().min(1, translate("app.widgets.forms.userCreate.merchant")).trim()
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

        try {
            await dataProvider.create(`users`, { data });

            toast.success(translate("resources.users.create.success"), {
                dismissible: true,
                duration: 3000,
                description: translate("resources.users.create.successMessage")
            });

            refresh();
            onOpenChange(false);
        } catch (error) {
            toast.error(translate("resources.users.create.error"), {
                dismissible: true,
                duration: 3000,
                description: translate("resources.users.create.errorMessage")
            });
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    if (contrProps.save !== undefined) {
        return (
            <CreateContextProvider value={contrProps}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
                        <div className="flex flex-col md:grid md:grid-cols-2 md:grid-template-rows-auto gap-y-5 gap-x-4 items-stretch md:items-baseline">
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
                                            <Select onValueChange={value => field.onChange(value)} value={field.value}>
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
                                                    error={fieldState.error?.message}
                                                    merchant={field.value}
                                                    onMerchantChanged={field.onChange}
                                                    resource="merchant"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="self-end flex items-center gap-4">
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
