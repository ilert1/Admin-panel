import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { feesDataProvider, FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { Fees } from "../components/Fees";

export const MerchantCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const dataProvider = useDataProvider();
    const controllerProps = useCreateController();
    const data = fetchDictionaries();
    const feeDataProvider = feesDataProvider({ id: "", resource: FeesResource.MERCHANT });

    const translate = useTranslate();
    const refresh = useRefresh();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [fees, setFees] = useState<Directions.FeeCreate[]>([]);
    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [addNewFeeClicked]);

    const onSubmit: SubmitHandler<Merchant> = async data => {
        if (submitButtonDisabled) return;

        setSubmitButtonDisabled(true);

        if (data?.description?.length === 0) {
            data.description = null;
        }
        if (data?.keycloak_id?.length === 0) {
            data.keycloak_id = null;
        }

        try {
            const info = await dataProvider.create("merchant", { data });
            feeDataProvider.setId(info.data.id);

            await fees.reduce((accum, item) => {
                return accum.then(() => feeDataProvider.addFee(item));
            }, Promise.resolve());

            refresh();
            onOpenChange(false);
        } catch (error) {
            toast.error("Error", {
                description: translate("resources.merchant.errors.alreadyInUse"),
                dismissible: true,
                duration: 3000
            });
        } finally {
            setSubmitButtonDisabled(false);
        }
    };

    const formSchema = z.object({
        id: z.string().min(1, translate("resources.merchant.errors.id")).trim(),
        name: z.string().min(1, translate("resources.merchant.errors.name")).trim(),
        description: z.string().trim().nullable(),
        keycloak_id: z
            .string()
            .nullable()
            .refine(value => value === null || !/\s/.test(value), {
                message: translate("resources.merchant.errors.noSpaces")
            }),
        fees: z.record(
            z.object({
                type: z.number(),
                value: z.number(),
                currency: z.string(),
                recipient: z.string(),
                direction: z.string()
            })
        )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            description: "",
            keycloak_id: "",
            fees: {}
        }
    });

    if (controllerProps.isLoading || !data) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className=""
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
                                            className=""
                                            variant={InputTypes.GRAY}
                                            label={translate("resources.merchant.fields.id")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                        />
                                    </FormControl>
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
                                            label={translate("resources.merchant.fields.descr")}
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
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
                                            label="Keycloak ID"
                                            error={fieldState.invalid}
                                            errorMessage={<FormMessage />}
                                            className=""
                                            value={field.value ?? ""}
                                            variant={InputTypes.GRAY}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <Fees
                id={""}
                fees={fees}
                feeTypes={data?.feeTypes}
                feesResource={FeesResource.MERCHANT}
                addNewOpen={addNewFeeClicked}
                setAddNewOpen={setAddNewFeeClicked}
                setFees={setFees}
            />
            <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col gap-3 sm:gap-0 sm:flex-row space-x-0 sm:space-x-2">
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
        </CreateContextProvider>
    );
};
