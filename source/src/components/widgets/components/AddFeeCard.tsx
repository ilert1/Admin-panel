import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingBlock } from "@/components/ui/loading";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { feesDataProvider, FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchDataForDirections } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateController, useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";

enum FeeEnum {
    FEE_FROM_SENDER = "FeeFromSender",
    FEE_FROM_TRANSACTION = "FeeFromTransaction"
}
export interface AddFeeCardProps {
    id: string;
    resource: FeesResource;
    onOpenChange: (state: boolean) => void;
    setFees?: React.Dispatch<React.SetStateAction<Directions.FeeCreate[]>>;
    variants?: string[];
}

export const AddFeeCard = (props: AddFeeCardProps) => {
    const { id, resource, onOpenChange, setFees, variants } = props;
    const translate = useTranslate();
    const refresh = useRefresh();
    const feeDataProvider = feesDataProvider({ id, resource });
    const data = fetchDictionaries();

    const { isLoading } = useCreateController({ resource });

    const { currencies, isLoading: loadingData } = useFetchDataForDirections();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const reqData: Directions.FeeCreate = {
            ...data,
            type: Number(data.type),
            direction: Number(data.direction),
            recipient: resource === FeesResource.DIRECTION ? "provider_fee" : "merchant_fee"
        };

        if (setFees) {
            setFees(prev => [...prev, reqData]);
            onOpenChange(false);
        } else {
            try {
                await feeDataProvider.addFee(reqData);
                refresh();
                onOpenChange(false);
            } catch (error) {
                toast.error(translate("resources.direction.fees.error"), {
                    description: translate("resources.direction.fees.errorWhenCreating"),
                    dismissible: true,
                    duration: 3000
                });
            }
        }
    };

    const formSchema = z.object({
        currency: z.string().min(1),
        value: z.coerce.number().min(0),
        type: z.string().min(1),
        description: z.string(),
        direction: z.string().min(1)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currency: "",
            value: 0,
            type: FeeEnum.FEE_FROM_SENDER,
            description: "",
            direction: ""
        }
    });

    if (isLoading || loadingData)
        return (
            <div className="h-[320px]">
                <LoadingBlock />
            </div>
        );
    const currenciesDisabled = !(currencies && Array.isArray(currencies.data) && currencies?.data?.length > 0);

    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
                    <div className="mb-[16px]">
                        <div className="bg-neutral-0 border border-neutral-70 rounded-[8px] px-[8px] pt-[16px] pb-[8px]">
                            <div className="w-full grid grid-cols-2 sm:grid-cols-4">
                                <FormField
                                    control={form.control}
                                    name="direction"
                                    render={({ field }) => (
                                        <FormItem className="p-2 col-span-2">
                                            <FormLabel>{translate("resources.direction.fees.direction")}</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {Object.entries(data.transactionTypes).map(el => {
                                                                    return (
                                                                        <SelectItem key={el[0]} value={el[0]}>
                                                                            {el[1].type_descr}
                                                                        </SelectItem>
                                                                    );
                                                                })}
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
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem className="p-2 col-span-2">
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
                                                                <SelectItem value={"1"}>
                                                                    {FeeEnum.FEE_FROM_SENDER}
                                                                </SelectItem>
                                                                <SelectItem value={"2"}>
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
                                        <FormItem className="p-2 col-span-2">
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
                                                                {!currenciesDisabled && !variants
                                                                    ? currencies.data.map(currency => (
                                                                          <SelectItem
                                                                              key={currency.code}
                                                                              /* disabled={
                                                                                  !(
                                                                                      currency.code === "TRY" ||
                                                                                      currency.code === "USDT"
                                                                                  )
                                                                              } */
                                                                              value={currency.code}>
                                                                              {currency.code}
                                                                          </SelectItem>
                                                                      ))
                                                                    : variants?.map(currency => (
                                                                          <SelectItem key={currency} value={currency}>
                                                                              {currency}
                                                                          </SelectItem>
                                                                      ))}
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
                                        <FormItem className="w-full p-2 col-span-2 sm:col-span-4">
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
                        </div>
                    </div>
                </form>
            </Form>
            <div className="w-full md:w-2/5 p-2 ml-auto flex space-x-2">
                <Button onClick={form.handleSubmit(onSubmit)} variant="default" className="flex-1">
                    {translate("app.ui.actions.save")}
                </Button>
                <Button
                    type="button"
                    variant="deleteGray"
                    className="flex-1"
                    onClick={() => {
                        refresh();
                        onOpenChange(false);
                    }}>
                    {translate("app.ui.actions.cancel")}
                </Button>
            </div>
        </>
    );
};
