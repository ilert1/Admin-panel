import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, InputTypes } from "@/components/ui/Input/input";
import { LoadingBlock } from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectType,
    SelectValue
} from "@/components/ui/select";
import { feesDataProvider, FeesResource } from "@/data";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { useFetchDataForDirections } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateController, useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { FeeCreate, FeeType as IFeeType } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";

enum FeeEnum {
    FEE_FROM_SENDER = "FeeFromSender",
    FEE_FROM_TRANSACTION = "FeeFromTransaction",
    FEE_FIX_WITHDRAW = "FeeFixWithdraw"
}

export type FeeType = "inner" | "default";

export interface AddFeeCardProps {
    id: string;
    resource: FeesResource;
    onOpenChange: (state: boolean) => void;
    setFees?: React.Dispatch<React.SetStateAction<(FeeCreate & { innerId?: number })[]>>;
    variants?: string[];
    feeType?: FeeType;
    providerName?: string;
}

export const AddFeeCard = (props: AddFeeCardProps) => {
    const { id, resource, onOpenChange, setFees, variants, providerName, feeType = "default" } = props;
    const translate = useTranslate();
    const refresh = useRefresh();

    const appToast = useAppToast();

    const feeDataProvider = feesDataProvider({ id, resource, providerName });
    const data = fetchDictionaries();

    const { isLoading } = useCreateController({ resource });

    const { currencies, isLoading: loadingData } = useFetchDataForDirections();

    const formSchema = z
        .object({
            currency: z.optional(z.string()),
            value: z.coerce
                .number({ message: translate("resources.direction.fees.valueFieldError") })
                .min(0, { message: translate("resources.direction.fees.valueFieldError") }),
            type: z.custom<IFeeType>(),
            description: z.string(),
            direction: z.string().min(1, { message: translate("resources.direction.fees.directionFieldError") })
        })
        .superRefine((data, ctx) => {
            if (data.type === IFeeType.NUMBER_3 && !data.currency) {
                ctx.addIssue({
                    path: ["currency"],
                    message: translate("resources.direction.fees.currencyFieldError"),
                    code: z.ZodIssueCode.custom
                });
            }
        });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (feeType === "inner") {
            if (setFees) {
                setFees(prev => [
                    ...prev,
                    {
                        ...data,
                        type: data.type,
                        direction: Number(data.direction),
                        recipient: resource === FeesResource.DIRECTION ? "provider_fee" : "merchant_fee",
                        innerId: new Date().getTime()
                    }
                ]);
                onOpenChange(false);
            }
            return;
        }
        const reqData: FeeCreate = {
            ...data,
            type: data.type,
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
                appToast("error", translate("resources.direction.fees.errorWhenCreating"));
            }
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: 0,
            type: 1,
            description: "",
            direction: "",
            currency: ""
        }
    });

    const typeValue = form.watch("type");

    if (isLoading || loadingData)
        return (
            <div className="h-[320px]">
                <LoadingBlock />
            </div>
        );
    const currenciesDisabled =
        !(currencies && Array.isArray(currencies.data) && currencies?.data?.length > 0) ||
        typeValue !== IFeeType.NUMBER_3;

    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
                    <div className="mb-[16px]">
                        <div className="bg-neutral-10 dark:bg-muted px-[8px] pt-[16px] pb-[8px] border border-neutral-40 dark:border-none rounded-[8px]">
                            <div className="grid grid-cols-2 sm:grid-cols-4 w-full">
                                <FormField
                                    control={form.control}
                                    name="direction"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <Label>{translate("resources.direction.fees.direction")}</Label>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            variant={SelectType.GRAY}
                                                            isError={fieldState.invalid}
                                                            errorMessage={<FormMessage />}
                                                            className="border-neutral-60">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.entries(data.transactionTypes).map(el => {
                                                                return (
                                                                    <SelectItem
                                                                        key={el[0]}
                                                                        value={el[0]}
                                                                        variant={SelectType.GRAY}>
                                                                        {el[1].type_descr}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    label={translate("resources.direction.fees.feeAmount")}
                                                    labelSize="note-1"
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    variant={InputTypes.GRAY}
                                                    borderColor="border-neutral-60"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <Label>{translate("resources.direction.fees.feeType")}</Label>
                                            <FormControl>
                                                <Select
                                                    value={field.value.toString()}
                                                    onValueChange={value => field.onChange(Number(value))}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            variant={SelectType.GRAY}
                                                            isError={fieldState.invalid}
                                                            errorMessage={<FormMessage />}
                                                            className="border-neutral-60">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem
                                                                value={IFeeType.NUMBER_1.toString()}
                                                                variant={SelectType.GRAY}>
                                                                {FeeEnum.FEE_FROM_SENDER}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={IFeeType.NUMBER_2.toString()}
                                                                variant={SelectType.GRAY}>
                                                                {FeeEnum.FEE_FROM_TRANSACTION}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value={IFeeType.NUMBER_3.toString()}
                                                                variant={SelectType.GRAY}>
                                                                {FeeEnum.FEE_FIX_WITHDRAW}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <Label>{translate("resources.direction.fees.currency")}</Label>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={currenciesDisabled}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            variant={SelectType.GRAY}
                                                            isError={fieldState.invalid}
                                                            errorMessage={<FormMessage />}
                                                            className="border-neutral-60">
                                                            <SelectValue
                                                                placeholder={
                                                                    currenciesDisabled
                                                                        ? typeValue !== IFeeType.NUMBER_3
                                                                            ? translate(
                                                                                  "resources.direction.errors.onlyThirdTypeError"
                                                                              )
                                                                            : translate(
                                                                                  "resources.direction.noCurrencies"
                                                                              )
                                                                        : ""
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {!currenciesDisabled && !variants?.length
                                                                ? currencies.data.map(currency => (
                                                                      <SelectItem
                                                                          variant={SelectType.GRAY}
                                                                          key={currency.code}
                                                                          value={currency.code}>
                                                                          {currency.code}
                                                                      </SelectItem>
                                                                  ))
                                                                : variants?.map(currency => (
                                                                      <SelectItem
                                                                          key={currency}
                                                                          value={currency}
                                                                          variant={SelectType.GRAY}>
                                                                          {currency}
                                                                      </SelectItem>
                                                                  ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 sm:col-span-4 p-2 w-full">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    label={translate("resources.direction.description")}
                                                    variant={InputTypes.GRAY}
                                                    error={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    className="border-neutral-60"
                                                    borderColor="border-neutral-60"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
            <div className="flex space-x-2 ml-auto p-2 pb-5 w-full md:w-2/5">
                <Button onClick={form.handleSubmit(onSubmit)} variant="default" className="flex-1">
                    {translate("app.ui.actions.save")}
                </Button>
                <Button
                    type="button"
                    variant="outline_gray"
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
