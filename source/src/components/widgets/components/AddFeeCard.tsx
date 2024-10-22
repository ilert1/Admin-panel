import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/input";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchDataForDirections } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateContextProvider, useCreateController, useDataProvider, useTranslate } from "react-admin";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

enum FeeEnum {
    FEE_FROM_SENDER = "FeeFromSender",
    FEE_FROM_TRANSACTION = "FeeFromTransaction"
}
export interface AddFeeCardProps {
    id?: string;
    onOpenChange: (state: boolean) => void;
}

export const AddFeeCard = (props: AddFeeCardProps) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { toast } = useToast();

    const data = fetchDictionaries();
    console.log(data);

    const { isLoading } = useCreateController({ resource: "direction" });
    const controllerProps = useCreateController();

    const { currencies, isLoading: loadingData } = useFetchDataForDirections();

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
        accountNumber: z.string().min(1),
        currency: z.string().min(1),
        value: z.number().int(),
        type: z.enum([FeeEnum.FEE_FROM_SENDER, FeeEnum.FEE_FROM_TRANSACTION]),
        description: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountNumber: "",
            currency: "",
            value: 0,
            type: FeeEnum.FEE_FROM_SENDER,
            description: ""
        }
    });

    if (isLoading || loadingData) return <LoadingAlertDialog />;
    const currenciesDisabled = !(currencies && Array.isArray(currencies.data) && currencies?.data?.length > 0);

    return (
        <CreateContextProvider value={controllerProps}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="mb-[16px]">
                        <div className="bg-neutral-0 border border-neutral-70 rounded-[8px] px-[8px] pt-[16px] pb-[8px]">
                            <div className="w-full grid grid-cols-2 ">
                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem className="p-2">
                                            <FormLabel>{translate("resources.direction.fees.accountNumber")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input {...field} />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem className="p-2">
                                            <FormLabel>{translate("resources.direction.fees.feeAmount")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input {...field} />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="p-2">
                                            <FormLabel>{translate("resources.direction.fees.feeType")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={currenciesDisabled}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value={FeeEnum.FEE_FROM_SENDER}>
                                                                    {FeeEnum.FEE_FROM_SENDER}
                                                                </SelectItem>
                                                                <SelectItem value={FeeEnum.FEE_FROM_TRANSACTION}>
                                                                    {FeeEnum.FEE_FROM_TRANSACTION}
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem className="p-2">
                                            <FormLabel>{translate("resources.direction.fees.currency")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={currenciesDisabled}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={
                                                                        currenciesDisabled
                                                                            ? translate(
                                                                                  "resources.direction.noCurrencies"
                                                                              )
                                                                            : ""
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {!currenciesDisabled
                                                                    ? currencies.data.map((currency: any) => (
                                                                          <SelectItem
                                                                              key={currency.code}
                                                                              value={currency.code}>
                                                                              {currency.code}
                                                                          </SelectItem>
                                                                      ))
                                                                    : ""}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="w-full p-2 col-span-2">
                                            <FormLabel>{translate("resources.direction.description")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input {...field} value={field.value ?? ""} />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                                <Button type="submit" variant="default" className="flex-1">
                                    {translate("app.ui.actions.save")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="deleteGray"
                                    className="flex-1"
                                    onClick={() => props.onOpenChange(false)}>
                                    {translate("app.ui.actions.cancel")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateContextProvider>
    );
};
