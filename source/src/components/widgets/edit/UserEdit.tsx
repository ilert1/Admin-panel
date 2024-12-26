import { useTranslate, useDataProvider, useRefresh } from "react-admin";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TriangleAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { usePreventFocus } from "@/hooks";
import { Loading } from "@/components/ui/loading";

interface UserEditProps {
    id: string;
    record: Omit<Users.User, "created_at" | "deleted_at" | "id">;
    onOpenChange: (state: boolean) => void;
}

export const UserEdit = ({ id, record, onOpenChange }: UserEditProps) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        try {
            await dataProvider.update("users", {
                id,
                data,
                previousData: undefined
            });

            toast.success(translate("resources.users.create.success"), {
                dismissible: true,
                duration: 3000,
                description: translate("resources.users.editSuccessMessage")
            });

            refresh();
            onOpenChange(false);
        } catch (error) {
            toast.error("Error", {
                description: translate("resources.currency.errors.alreadyInUse"),
                dismissible: true,
                duration: 3000
            });
            setSubmitButtonDisabled(false);
        }
    };

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
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
        form.setValue("public_key", e.target.value);
        field.onChange(e.target.value);
    };

    const formSchema = z.object({
        name: z.string().min(3, translate("app.widgets.forms.userCreate.nameMessage")).trim(),
        public_key: z
            .string()
            .startsWith("-----BEGIN PUBLIC KEY-----", translate("app.widgets.forms.userCreate.publicKeyMessage"))
            .endsWith("-----END PUBLIC KEY-----", translate("app.widgets.forms.userCreate.publicKeyMessage"))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: record?.name || "",
            public_key: record?.public_key || ""
        }
    });

    useEffect(() => {
        if (record) {
            form.reset({
                name: record?.name || "",
                public_key: record?.public_key || ""
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
                <div className="grid grid-cols-1 grid-rows-4 gap-4">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-1 w-full">
                                <FormLabel>{translate("app.widgets.forms.userCreate.name")}</FormLabel>
                                <FormControl>
                                    <Input
                                        className={`dark:bg-muted text-sm text-neutral-100 shadow-1 disabled:dark:bg-muted ${
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
                        className="row-span-3 self-stretch"
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
                                            className={`dark:bg-muted text-sm text-neutral-100 shadow-1 disabled:dark:bg-muted h-full resize-none min-h-20 ${
                                                fieldState.invalid
                                                    ? "border-red-40 hover:border-red-50 focus-visible:border-red-50"
                                                    : ""
                                            }`}
                                            value={field.value}
                                            onChange={e => handleTextChange(e, field)}
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
                </div>
                <div className="self-end flex items-center gap-4">
                    <Button type="submit" disabled={submitButtonDisabled}>
                        {translate("app.ui.actions.save")}
                    </Button>

                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        variant="deleteGray"
                        className="border border-neutral-50 rounded-4 hover:border-neutral-100">
                        {translate("app.widgets.forms.userCreate.cancelBtn")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
