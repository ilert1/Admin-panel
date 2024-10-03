import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTranslate } from "react-admin";
import { useMemo, useState } from "react";
import { DialogClose } from "@/components/ui/dialog";

export const UserCreateForm = (props: { onSubmit: (data: any) => void; isDisabled: boolean; currencies: any }) => {
    const translate = useTranslate();
    const [openCurDialog, setOpenCurDialog] = useState(false);
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
                <div className="grid  grid-cols-1 md:grid-cols-2 md:grid-rows-5 gap-y-5 gap-x-4 items-end grid-flow-col">
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

                                <Popover open={openCurDialog} onOpenChange={setOpenCurDialog}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCurDialog}
                                                className="w-full flex justify-between bg-muted text-sm text-neutral-100 border-neutral-40">
                                                {valueCurDialog
                                                    ? sortedCurrencies.find(
                                                          (cur: any) => cur["alpha-3"] === valueCurDialog
                                                      )["alpha-3"]
                                                    : translate("app.widgets.forms.userCreate.shopCurrencyPlaceholder")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder={translate(
                                                    "app.widgets.forms.userCreate.shopCurrencyPlaceholder"
                                                )}
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {translate("app.widgets.forms.userCreate.shopCurrencyMessage")}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {sortedCurrencies.map((cur: any) => (
                                                        <CommandItem
                                                            key={cur["alpha-3"]}
                                                            value={cur["alpha-3"]}
                                                            onSelect={currentValue => {
                                                                form.setValue("shop_currency", cur["alpha-3"]);
                                                                field.onChange(cur["alpha-3"]);
                                                                setValueCurDialog(
                                                                    currentValue === valueCurDialog ? "" : currentValue
                                                                );
                                                                setOpenCurDialog(false);
                                                            }}>
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    valueCurDialog === cur["alpha-3"]
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {cur["alpha-3"]}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

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
