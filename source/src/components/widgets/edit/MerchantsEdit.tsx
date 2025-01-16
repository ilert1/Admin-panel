import { useEditController, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { FeesResource } from "@/data";
import { usePreventFocus } from "@/hooks";
import { Fees } from "../components/Fees";

interface MerchantEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantEdit = ({ id = "", onOpenChange }: MerchantEditProps) => {
    const data = fetchDictionaries();
    const dataProvider = useDataProvider();

    const { record, isLoading } = useEditController({ resource: "merchant", id, mutationMode: "pessimistic" });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const translate = useTranslate();
    const refresh = useRefresh();

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            if (addNewFeeClicked) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [addNewFeeClicked]);

    const onSubmit = async (data: z.infer<typeof formSchema> & { fees?: Pick<Merchant, "fees"> }) => {
        if (submitButtonDisabled) return;
        setSubmitButtonDisabled(true);
        data.fees = record.fees;
        try {
            await dataProvider.update("merchant", {
                id,
                data,
                previousData: undefined
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

    usePreventFocus({ dependencies: [record] });

    if (isLoading || !record || !data) return <Loading />;
    const fees = record.fees;
    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.name")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.id")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keycloak_id"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                            label="Keycloak ID"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <Fees
                id={id}
                fees={fees}
                feeTypes={data.feeTypes}
                feesResource={FeesResource.MERCHANT}
                addNewOpen={addNewFeeClicked}
                setAddNewOpen={setAddNewFeeClicked}
                className="max-h-[45dvh]"
            />

            <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row gap-3 sm:gap-0 space-x-0 sm:space-x-2">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="outline_gray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </>
    );
};
