import {
    useEditController,
    EditContextProvider,
    useRedirect,
    useTranslate,
    useDataProvider,
    useRefresh
} from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loading } from "@/components/ui/loading";

import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

export const MerchantEdit = () => {
    const dataProvider = useDataProvider();

    const controllerProps = useEditController();
    controllerProps.mutationMode = "pessimistic";

    const { record, isLoading } = useEditController();

    const { id } = useParams();
    const translate = useTranslate();
    const redirect = useRedirect();
    const { toast } = useToast();
    const refresh = useRefresh();

    const formSchema = z.object({
        id: z.string().min(1, translate("resources.merchant.errors.id")).trim(),
        name: z.string().min(1, translate("resources.merchant.errors.name")).trim(),
        description: z.string().trim().nullable(),
        keycloak_id: z
            .string()
            .nullable()
            .refine(value => value === null || !/\s/.test(value), {
                message: translate("resources.merchant.errors.noSpaces")
            })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: record?.id || "",
            name: record?.name || "",
            description: record?.description || "",
            keycloak_id: record?.keycloak_id || ""
        }
    });

    useEffect(() => {
        if (record) {
            form.reset({
                id: record?.id || "",
                name: record?.name || "",
                description: record?.description || "",
                keycloak_id: record?.keycloak_id || ""
            });
        }
    }, [form, record]);

    const onSubmit: SubmitHandler<Merchant> = async data => {
        try {
            await dataProvider.update("merchant", {
                id,
                data,
                previousData: undefined
            });
            refresh();
            redirect("list", "merchant");
        } catch (error) {
            toast({
                description: translate("resources.currency.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    if (isLoading || !record) return <Loading />;

    return (
        <EditContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.id")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} disabled />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>{translate("resources.merchant.fields.descr")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keycloak_id"
                            render={({ field }) => (
                                <FormItem className="w-full p-2">
                                    <FormLabel>Keycloak ID</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                            <Button
                                type="button"
                                variant="error"
                                className="flex-1"
                                onClick={() => redirect("list", "merchant")}>
                                {translate("app.ui.actions.cancel")}
                            </Button>
                            <Button type="submit" variant="default" className="flex-1">
                                {translate("app.ui.actions.save")}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </EditContextProvider>
    );
};
