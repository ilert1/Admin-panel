import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateContextProvider, useCreateController, useDataProvider, useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const AddFeeCard = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { toast } = useToast();

    const { isLoading } = useCreateController({ resource: "direction" });
    const controllerProps = useCreateController();

    const onSubmit: SubmitHandler<Directions.Fees> = async data => {
        try {
            await dataProvider.create("direction", { data });
        } catch (error) {
            toast({
                description: translate("resources.provider.errors.alreadyInUse"),
                variant: "destructive",
                title: "Error"
            });
        }
    };

    const formSchema = z.object({
        name: z.string().min(1, translate("resources.direction.errors.name")).trim(),
        active: z.boolean().default(false),
        description: z.string().trim().nullable(),
        src_currency: z.string().min(1, translate("resources.direction.errors.src_curr")),
        dst_currency: z.string().min(1, translate("resources.direction.errors.dst_curr")),
        merchant: z.string().min(1, translate("resources.direction.errors.merchant")),
        provider: z.string().min(1, translate("resources.direction.errors.provider")),
        weight: z.coerce.number()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            active: true,
            description: "",
            src_currency: "",
            dst_currency: "",
            merchant: "",
            provider: "",
            weight: 0
        }
    });
    if (isLoading) return <Loading />;
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
                                    <FormLabel>{translate("resources.direction.fields.name")}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input {...field} className="bg-muted" variant={InputTypes.GRAY} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};

// <div className="mb-[16px]">
// <div className="bg-neutral-0 border border-neutral-70 rounded-[8px] px-[8px] pt-[16px] pb-[8px]">
//     <div className="w-full grid grid-cols-2 gap-y-[8px]">
//         <div className="flex flex-col gap-[4px] w-1/2">
//             <Label className="text-title-1 text-neutral-40" htmlFor="">
//                 {translate("resources.direction.fees.accountNumber")}
//             </Label>
//             <TextField copyValue text={account} />
//         </div>
//         <div className="flex flex-col gap-[4px] w-1/2">
//             <Label className="text-title-1 text-neutral-40" htmlFor="">
//                 {translate("resources.direction.fees.feeAmount")}
//             </Label>
//             <TextField text={String(feeAmount)} />
//         </div>
//         <div className="flex flex-col gap-[4px]">
//             <Label className="text-title-1 text-neutral-40" htmlFor="">
//                 {translate("resources.direction.fees.feeType")}
//             </Label>
//             <TextField text={String(feeType)} />
//         </div>
//         <div className="flex flex-col gap-[4px]">
//             <Label className="text-title-1 text-neutral-40" htmlFor="">
//                 {translate("resources.direction.fees.currency")}
//             </Label>
//             <TextField text={String(currency)} />
//         </div>
//         <div className="flex flex-col gap-[4px] row-span-2">
//             <Label className="text-title-1 text-neutral-40" htmlFor="">
//                 {translate("resources.direction.fees.descr")}
//             </Label>
//             <TextField text={String(description)} />
//         </div>
//     </div>
//     <div className="flex justify-end mt-6">
//         <Button variant={"deleteGray"}>{translate("app.ui.actions.delete")}</Button>
//     </div>
// </div>
// </div>
