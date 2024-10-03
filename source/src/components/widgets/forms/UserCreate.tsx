import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useMemo, useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const UserCreateForm = (props: { onSubmit: (data: any) => void; isDisabled: boolean; currencies: any }) => {
    const translate = useTranslate();
    const [valueCurDialog, setValueCurDialog] = useState("");

    const sortedCurrencies = useMemo(() => {
        return props.currencies?.sort((a: any, b: any) => a["alpha-3"] > b["alpha-3"]) || [];
    }, [props.currencies]);

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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-5 md:grid-flow-col gap-y-5 gap-x-4 items-stretch md:items-end">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="login"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.login")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.email")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_currency"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block">
                                    {translate("app.widgets.forms.userCreate.shopCurrency")}
                                </FormLabel>

                                <Select
                                    onValueChange={currentValue => {
                                        form.setValue("shop_currency", currentValue);
                                        field.onChange(currentValue);
                                        setValueCurDialog(currentValue === valueCurDialog ? "" : currentValue);
                                    }}
                                    value={valueCurDialog}>
                                    <SelectTrigger className="bg-muted">
                                        <SelectValue placeholder={"RUB"} />
                                    </SelectTrigger>
                                    <SelectContent className="!bg-muted">
                                        {sortedCurrencies &&
                                            sortedCurrencies.map((cur: any) => (
                                                <SelectItem key={cur["alpha-3"]} value={cur["alpha-3"]}>
                                                    {cur["alpha-3"]}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}>
                        <FormField
                            name="public_key"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>{translate("app.widgets.forms.userCreate.publicKey")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-muted text-sm text-neutral-100"
                                            value={fileContent}
                                            onChange={e => handleTextChange(e, field)}
                                            onInput={e => handleTextChange(e, field)}
                                            placeholder="Drop file here or type text"
                                            disabled={props.isDisabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="shop_api_key"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopApiKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_sign_key"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopSignKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="shop_balance_key"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopBalanceKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-muted text-sm text-neutral-100"
                                        disabled={props.isDisabled}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="self-end flex items-center gap-4">
                    <Button type="submit">{translate("app.widgets.forms.userCreate.createUser")}</Button>

                    <DialogClose asChild>
                        <Button
                            type="button"
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
