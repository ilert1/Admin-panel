import { useEditController, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/ui/loading";

import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { FeeCard } from "../components/FeeCard";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { CircleChevronRight } from "lucide-react";
import { AddFeeCard } from "../components/AddFeeCard";
import { FeesResource } from "@/data";

interface MerchantEditProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const MerchantEdit = (props: MerchantEditProps) => {
    const params = useParams();
    const id = props.id || params.id || "";
    const data = fetchDictionaries();

    const { onOpenChange } = props;
    const dataProvider = useDataProvider();

    const controllerProps = useEditController({ resource: "merchant", id });
    controllerProps.mutationMode = "pessimistic";
    const { record, isLoading } = useEditController({ resource: "merchant", id });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const translate = useTranslate();
    const { toast } = useToast();
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

    const onSubmit: SubmitHandler<Merchant> = async data => {
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
            toast({
                description: translate("resources.currency.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
            setSubmitButtonDisabled(false);
        }
    };

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
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-1/2 p-2">
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
                                <FormItem className="w-1/2 p-2">
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
                    </div>
                </form>
            </Form>
            <div className="flex flex-col bg-neutral-0 px-[32px] rounded-[8px] w-full mx-[10px] mt-[10px]">
                <h3 className="text-display-3 mt-[16px] mb-[16px]">{translate("resources.direction.fees.fees")}</h3>
                <div className="max-h-[40vh] overflow-auto pr-[10px]">
                    {fees && Object.keys(fees).length !== 0
                        ? Object.keys(fees).map(key => {
                              const fee = fees[key];
                              return (
                                  <FeeCard
                                      key={fee.id}
                                      account={fee.id}
                                      currency={fee.currency}
                                      feeAmount={fee.value.quantity / fee.value.accuracy}
                                      feeType={data.feeTypes[fee.type]?.type_descr || ""}
                                      id={id}
                                      resource={FeesResource.MERCHANT}
                                  />
                              );
                          })
                        : ""}
                    {addNewFeeClicked && (
                        <AddFeeCard
                            id={record.id}
                            onOpenChange={setAddNewFeeClicked}
                            resource={FeesResource.MERCHANT}
                        />
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => setAddNewFeeClicked(true)} className="my-6 w-1/4 flex gap-[4px]">
                        <CircleChevronRight className="w-[16px] h-[16px]" />
                        {translate("resources.direction.fees.addFee")}
                    </Button>
                </div>
            </div>
            <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="deleteGray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </>
    );
};
