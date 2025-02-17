import { toast } from "sonner";
import { CreateContextProvider, useCreateController, useDataProvider, useRefresh, useTranslate } from "react-admin";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectType, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFetchCurrencies } from "@/hooks/useFetchCurrencies";
import { Label } from "@/components/ui/label";

interface UserCreateProps {
    onOpenChange: (state: boolean) => void;
}

export const UserCreate = ({ onOpenChange }: UserCreateProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const contrProps = useCreateController();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [valueCurDialog, setValueCurDialog] = useState("");

    const { isLoading: currenciesLoading, data: currencies } = useFetchCurrencies();

    const sortedCurrencies = useMemo(() => {
        return currencies?.data.sort((a, b) => (a["alpha-3"] > b["alpha-3"] ? 1 : -1)) || [];
    }, [currencies]);

    const isFirefox = useMemo(() => navigator.userAgent.match(/firefox|fxios/i), []);

    const formSchema = z.object({
        name: z.string().min(3, translate("app.widgets.forms.userCreate.nameMessage")).trim(),
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
        public_key: z
            .string()
            .startsWith("-----BEGIN PUBLIC KEY-----", translate("app.widgets.forms.userCreate.publicKeyMessage"))
            .endsWith("-----END PUBLIC KEY-----", translate("app.widgets.forms.userCreate.publicKeyMessage")),
        shop_currency: z.string().regex(/^[A-Z]{3}$/, translate("app.widgets.forms.userCreate.shopCurrencyMessage"))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            login: "",
            email: "",
            password: "",
            public_key: "",
            shop_currency: ""
        }
    });

    const [fileContent, setFileContent] = useState("");

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setFileContent(reader.result.replaceAll("\n", ""));
                    form.setValue("public_key", reader.result.replaceAll("\n", ""));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<z.infer<typeof formSchema>>
    ) => {
        setFileContent(e.target.value);
        form.setValue("public_key", e.target.value);
        field.onChange(e.target.value);
    };

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
                        <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-[repeat(4,auto)]  md:grid-flow-col gap-y-5 gap-x-4 items-stretch md:items-baseline">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormControl>
                                            <Input
                                                label={translate("app.widgets.forms.userCreate.name")}
                                                autoComplete={isFirefox ? "new-password" : "off"}
                                                autoCorrect="off"
                                                autoCapitalize="none"
                                                spellCheck="false"
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                disabled={currenciesLoading}
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
                                                disabled={currenciesLoading}
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
                                                disabled={currenciesLoading}
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
                                                type="text"
                                                label={translate("app.widgets.forms.userCreate.password")}
                                                error={fieldState.invalid}
                                                errorMessage={<FormMessage />}
                                                disabled={currenciesLoading}
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
                                name="shop_currency"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-2">
                                        <Label>{translate("app.widgets.forms.userCreate.shopCurrency")}</Label>
                                        <FormControl>
                                            <Select
                                                onValueChange={currentValue => {
                                                    form.setValue("shop_currency", currentValue);
                                                    field.onChange(currentValue);
                                                    setValueCurDialog(
                                                        currentValue === valueCurDialog ? "" : currentValue
                                                    );
                                                }}
                                                value={valueCurDialog}>
                                                <SelectTrigger
                                                    variant={SelectType.GRAY}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}>
                                                    <SelectValue
                                                        placeholder={translate(
                                                            "app.widgets.forms.userCreate.shopCurrencyPlaceholder"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="!dark:bg-muted">
                                                    {sortedCurrencies &&
                                                        sortedCurrencies.map(cur => (
                                                            <SelectItem
                                                                key={cur["alpha-3"]}
                                                                value={cur["alpha-3"]}
                                                                variant={SelectType.GRAY}>
                                                                {cur["alpha-3"]}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div
                                className="row-span-2 h-full w-full"
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleFileDrop}>
                                <FormField
                                    name="public_key"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FormItem className="space-y-0 h-full flex flex-col">
                                            <Label>{translate("app.widgets.forms.userCreate.publicKey")}</Label>
                                            <FormControl>
                                                <Textarea
                                                    value={fileContent}
                                                    onChange={e => handleTextChange(e, field)}
                                                    placeholder={translate(
                                                        "app.widgets.forms.userCreate.publicKeyPlaceholder"
                                                    )}
                                                    className={`h-full resize-none min-h-20 dark:bg-muted`}
                                                    disabled={currenciesLoading}
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
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
