import { useTranslate, useDataProvider, useRedirect, useRefresh } from "react-admin";
import { API_URL } from "@/data/base";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { useQuery } from "react-query";
import { Textarea } from "@/components/ui/textarea";

export const UserEdit = ({ id, record }: { id: string; record: any }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const redirect = useRedirect();
    const { toast } = useToast();
    const refresh = useRefresh();

    const [fileContent, setFileContent] = useState(record?.public_key || "");
    const [valueCurDialog, setValueCurDialog] = useState("");

    const onSubmit = async (data: any) => {
        try {
            await dataProvider.update("users", {
                id,
                data,
                previousData: undefined
            });
            refresh();
            redirect("list", "users");
        } catch (error) {
            toast({
                description: translate("resources.currencies.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
    };
    // 469c2a56-bef6-4fe1-b790-75e0bfe10743
    const { data: currencies } = useQuery("currencies", () =>
        fetch(`${API_URL}/dictionaries/curr`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        }).then(response => response.json())
    );

    const sortedCurrencies = useMemo(() => {
        return currencies?.data.sort((a: any, b: any) => a["alpha-3"] > b["alpha-3"]) || [];
    }, [currencies]);

    const handleFileDrop = (e: any) => {
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
    const handleTextChange = (e: any, field: any) => {
        setFileContent(e.target.value);
        form.setValue("public_key", e.target.value);
        field.onChange(e.target.value);
    };

    const formSchema = z.object({
        name: z.string().min(3, translate("app.widgets.forms.userCreate.nameMessage")).trim(),
        login: z.string().min(3, translate("app.widgets.forms.userCreate.loginMessage")).trim(),
        email: z
            .string()
            .regex(/^\S+@\S+\.\S+$/, translate("app.widgets.forms.userCreate.emailMessage"))
            .trim(),
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
            name: record?.name || "",
            login: record?.login || "",
            email: record?.email || "",
            public_key: fileContent,
            shop_currency: record?.shop_currency || "",
            shop_api_key: record?.shop_api_key || "",
            shop_sign_key: record?.shop_sign_key || "",
            shop_balance_key: record?.shop_balance_key || ""
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" autoComplete="off">
                <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-5 md:grid-flow-col gap-y-4 gap-x-4 items-stretch md:items-end">
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
                                            onInput={e => handleTextChange(e, field)}
                                            placeholder={translate(
                                                "app.widgets.forms.userCreate.publicKeyPlaceholder"
                                            )}>
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
                        name="shop_currency"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem>
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
                                            sortedCurrencies.map((cur: any) => (
                                                <SelectItem key={cur["alpha-3"]} value={cur["alpha-3"]}>
                                                    {cur["alpha-3"]}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

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
                    <Button type="submit">Edit user</Button>

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
