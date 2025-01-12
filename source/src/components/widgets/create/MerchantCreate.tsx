import { useCreateController, CreateContextProvider, useTranslate, useDataProvider, useRefresh } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { AddFeeCard } from "../components/AddFeeCard";
import { feesDataProvider, FeesResource } from "@/data";
import { FeeCard } from "../components/FeeCard";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { CircleChevronRight } from "lucide-react";

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

    if (controllerProps.isLoading) return <Loading />;

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-wrap">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full sm:w-1/2 p-2">
                                    <FormLabel>{translate("resources.merchant.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} className="" variant={InputTypes.GRAY} />
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
                                            <Input {...field} className="" variant={InputTypes.GRAY} />
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
                                            <Input
                                                {...field}
                                                className=""
                                                value={field.value ?? ""}
                                                variant={InputTypes.GRAY}
                                            />
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
                                            <Input
                                                {...field}
                                                className=""
                                                value={field.value ?? ""}
                                                variant={InputTypes.GRAY}
                                            />
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
                        {fees &&
                            fees.map((el, index) => {
                                return (
                                    <FeeCard
                                        key={index}
                                        account={""}
                                        currency={el.currency}
                                        feeAmount={el.value}
                                        feeType={data.feeTypes[el.type]?.type_descr || ""}
                                        id={""}
                                        resource={FeesResource.MERCHANT}
                                        description={el.description}
                                    />
                                );
                            })}
                        {addNewFeeClicked && (
                            <AddFeeCard
                                id={""}
                                onOpenChange={setAddNewFeeClicked}
                                resource={FeesResource.MERCHANT}
                                setFees={setFees}
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
            <div className="w-full md:w-2/5 p-2 ml-auto flex flex-col gap-3 sm:gap-0 sm:flex-row space-x-0 sm:space-x-2">
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
        </CreateContextProvider>
    );
};
