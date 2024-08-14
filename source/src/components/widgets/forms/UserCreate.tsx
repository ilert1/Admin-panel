"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useState } from "react";

export const UserCreateForm = (props: { onSubmit: (data: any) => void; isDisabled: boolean }) => {
    const translate = useTranslate();

    const formSchema = z.object({
        name: z.string().min(3, translate("app.widgets.forms.userCreate.nameMessage")),
        login: z.string().min(3, translate("app.widgets.forms.userCreate.loginMessage")),
        email: z.string().regex(/^\S+@\S+\.\S+$/, translate("app.widgets.forms.userCreate.emailMessage")),
        password: z
            .string()
            .regex(
                /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                translate("app.widgets.forms.userCreate.passwordMessage")
            ),
        publicKey: z.string(),
        shopCurrency: z.string().regex(/^[A-Z]{3}$/, translate("app.widgets.forms.userCreate.shopCurrencyMessage")),
        shopApiKey: z
            .string()
            .regex(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                translate("app.widgets.forms.userCreate.keyMessage")
            ),
        shopSignKey: z
            .string()
            .regex(
                /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                translate("app.widgets.forms.userCreate.keyMessage")
            ),
        shopBalanceKey: z
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
            publicKey: "",
            shopCurrency: "",
            shopApiKey: "",
            shopSignKey: "",
            shopBalanceKey: ""
        }
    });

    const [fileContent, setFileContent] = useState("");
    const handleFileDrop = (e: any) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                typeof reader.result === "string" && setFileContent(reader.result.replaceAll("\n", ""));
            };
            reader.readAsText(file);
        }
    };
    const handleTextChange = (e: any) => {
        setFileContent(e.target.value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.name")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="login"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.login")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.email")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.password")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="publicKey"
                        control={form.control}
                        render={() => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.publicKey")}</FormLabel>
                                <FormControl>
                                    <Input
                                        value={fileContent}
                                        onChange={handleTextChange}
                                        placeholder="Drop file here or type text"
                                        className="w-full text-left"
                                        disabled={props.isDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="shopCurrency"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopCurrency")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="shopApiKey"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopApiKey")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="shopSignKey"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopSignKey")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        name="shopBalanceKey"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translate("app.widgets.forms.userCreate.shopBalanceKey")}</FormLabel>
                                <FormControl>
                                    <Input disabled={props.isDisabled} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">{translate("app.widgets.forms.userCreate.createUser")}</Button>
            </form>
        </Form>
    );
};
