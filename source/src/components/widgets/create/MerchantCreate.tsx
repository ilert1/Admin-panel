import {
    useCreateController,
    CreateContextProvider,
    useRedirect,
    useTranslate,
    useDataProvider,
    useRefresh
} from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { AddFeeCard } from "../components/AddFeeCard";
import { feesDataProvider, FeesResource } from "@/data";
import { FeeCard } from "../components/FeeCard";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { CircleChevronRight } from "lucide-react";

export const MerchantCreate = ({ onOpenChange }: { onOpenChange: (state: boolean) => void }) => {
    const dataProvider = useDataProvider();
    const { isLoading } = useCreateController({ resource: "merchant" });
    const controllerProps = useCreateController();
    const data = fetchDictionaries();
    const feeDataProvider = feesDataProvider({ id: "", resource: FeesResource.MERCHANT });

    const translate = useTranslate();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [fees, setFees] = useState<Directions.FeeCreate[]>([]);
    const [addNewFeeClicked, setAddNewFeeClicked] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [addNewFeeClicked]);

    const handleDeleteFee = (id: string) => {
        console.log(id);
        const newFees = fees.filter(el => {
            console.log(el);
            return el.innerId !== id;
        });
        setFees(newFees);
    };

    const onSubmit: SubmitHandler<Merchant> = async data => {
        if (data?.description?.length === 0) {
            data.description = null;
        }
        if (data?.keycloak_id?.length === 0) {
            data.keycloak_id = null;
        }
        try {
            const info = await dataProvider.create("merchant", { data });
            feeDataProvider.setId(info.data.id);

            fees.map(async el => {
                delete el.innerId;
                await feeDataProvider.addFee(el);
            });
            refresh();
            onOpenChange(false);
        } catch (error) {
            toast({
                description: translate("resources.merchant.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
        redirect("list", "merchant");
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

    if (isLoading) return <Loading />;
    console.log(fees);
    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    {fees &&
                        fees.map(el => {
                            return (
                                <FeeCard
                                    key={el.innerId}
                                    account={""}
                                    currency={el.currency}
                                    feeAmount={el.value}
                                    feeType={data.feeTypes[el.type]?.type_descr || ""}
                                    id={""}
                                    resource={FeesResource.MERCHANT}
                                    innerId={el.innerId}
                                    deleteFunction={handleDeleteFee}
                                />
                            );
                        })}
                    {addNewFeeClicked && (
                        <AddFeeCard
                            id={""}
                            onOpenChange={setAddNewFeeClicked}
                            resource={FeesResource.MERCHANT}
                            setFees={setFees}
                            fees={fees}
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
                <Button onClick={form.handleSubmit(onSubmit)} variant="default" className="flex-1">
                    {translate("app.ui.actions.save")}
                </Button>
                <Button type="button" variant="deleteGray" className="flex-1" onClick={() => onOpenChange(false)}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </CreateContextProvider>
    );
};
