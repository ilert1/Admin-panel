import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const UserCreateForm = (props: {
    onSubmit: SubmitHandler<Omit<Users.User, "created_at" | "deleted_at" | "id">>;
    isDisabled: boolean;
    currencies: Dictionaries.Currency[];
    buttonDisabled: boolean;
}) => {
    const translate = useTranslate();
    const [valueCurDialog, setValueCurDialog] = useState("");

    const sortedCurrencies = useMemo(() => {
        return props.currencies?.sort((a, b) => (a["alpha-3"] > b["alpha-3"] ? 1 : -1)) || [];
    }, [props.currencies]);

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
        shop_currency: z.string().regex(/^[A-Z]{3}$/, translate("app.widgets.forms.userCreate.shopCurrencyMessage")),
        shop_api_key: z
            .string()
            .regex(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                translate("app.widgets.forms.userCreate.keyMessage")
            ),
        shop_sign_key: z
            .string()
            .regex(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                translate("app.widgets.forms.userCreate.keyMessage")
            ),
        shop_balance_key: z
            .string()
            .regex(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                translate("app.widgets.forms.userCreate.keyMessage")
            )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            login: "",
            email: "",
            password: "",
            public_key: "",
            shop_currency: "",
            shop_api_key: "",
            shop_sign_key: "",
            shop_balance_key: ""
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-6" autoComplete="off">
                <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-5 md:grid-flow-col gap-y-5 gap-x-4 items-stretch md:items-end">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        autoComplete={isFirefox ? "new-password" : "off"}
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        spellCheck="false"
                                        disabled={props.isDisabled}
                                        {...field}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="login"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.login")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        autoComplete={isFirefox ? "new-password" : "off"}
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        spellCheck="false"
                                        {...field}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        {...field}
                                        spellCheck="false"
                                        autoCorrect="off"
                                        autoComplete={isFirefox ? "new-password" : "off"}
                                        autoCapitalize="none"
                                        ref={input => {
                                            if (input) {
                                                input.removeAttribute("readonly");
                                            }
                                        }}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        {...field}
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        spellCheck="false"
                                        autoCapitalize="none"
                                        ref={input => {
                                            if (input) {
                                                input.removeAttribute("readonly");
                                            }
                                        }}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_currency"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopCurrency")}</FormLabel>

                                <Select
                                    onValueChange={currentValue => {
                                        form.setValue("shop_currency", currentValue);
                                        field.onChange(currentValue);
                                        setValueCurDialog(currentValue === valueCurDialog ? "" : currentValue);
                                    }}
                                    value={valueCurDialog}>
                                    <SelectTrigger
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}>
                                        <div className="mr-auto">
                                            <SelectValue
                                                placeholder={translate(
                                                    "app.widgets.forms.userCreate.shopCurrencyPlaceholder"
                                                )}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="ml-3 order-3" asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent className="!dark:bg-muted">
                                        {sortedCurrencies &&
                                            sortedCurrencies.map(cur => (
                                                <SelectItem key={cur["alpha-3"]} value={cur["alpha-3"]}>
                                                    {cur["alpha-3"]}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <div
                        className="row-span-2 self-stretch"
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleFileDrop}>
                        <FormField
                            name="public_key"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col h-full">
                                    <FormLabel>{translate("app.widgets.forms.userCreate.publicKey")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted h-full resize-none min-h-20 ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            value={fileContent}
                                            onChange={e => handleTextChange(e, field)}
                                            placeholder={translate("app.widgets.forms.userCreate.publicKeyPlaceholder")}
                                            disabled={props.isDisabled}>
                                            {fieldState.invalid && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <TriangleAlert
                                                                className="text-red-40"
                                                                width={14}
                                                                height={14}
                                                            />
                                                        </TooltipTrigger>

                                                        <TooltipContent className="border-none bottom-0" side="left">
                                                            <FormMessage />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </Textarea>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="shop_api_key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopApiKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        {...field}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_sign_key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopSignKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        {...field}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_balance_key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopBalanceKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 disabled:dark:bg-muted ${
                                            fieldState.invalid
                                                ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                : ""
                                        }`}
                                        disabled={props.isDisabled}
                                        {...field}>
                                        {fieldState.invalid && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="text-red-40" width={14} height={14} />
                                                    </TooltipTrigger>

                                                    <TooltipContent className="border-none bottom-0" side="left">
                                                        <FormMessage />
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="self-end flex items-center gap-4">
                    <Button type="submit" disabled={props.buttonDisabled}>
                        {translate("app.ui.actions.save")}
                    </Button>

                    <DialogClose asChild>
                        <Button
                            variant="clearBtn"
                            className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                            {translate("app.widgets.forms.userCreate.cancelBtn")}
                        </Button>
                    </DialogClose>
                </div>
            </form>
        </Form>
    );
};
