import { useEditController, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { FeeCard } from "../components/FeeCard";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { CircleChevronRight } from "lucide-react";
import { AddFeeCard } from "../components/AddFeeCard";
import { FeesResource } from "@/data";
import { usePreventFocus } from "@/hooks";

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
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} variant={InputTypes.GRAY} />
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
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.id")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} disabled variant={InputTypes.GRAY} />
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
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.descr")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} variant={InputTypes.GRAY} />
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
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>Keycloak ID</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} value={field.value ?? ""} variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <div className="px-2 mt-[10px] w-full">
                <div className="flex flex-col bg-neutral-0 px-[32px] rounded-[8px] w-full">
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
                                          description={fee.description}
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
                        <Button
                            onClick={() => setAddNewFeeClicked(true)}
                            className="my-6 w-1/2 sm:w-1/4 flex gap-[4px]">
                            <CircleChevronRight className="w-[16px] h-[16px]" />
                            {translate("resources.direction.fees.addFee")}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col sm:flex-row gap-3 sm:gap-0 space-x-0 sm:space-x-2">
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
