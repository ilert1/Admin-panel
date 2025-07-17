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
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateController, useRefresh, useTranslate } from "react-admin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Currency, FeeCreate, FeeType as IFeeType } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { useMemo, useState } from "react";
import { SmallFeeDialog } from "./SmallFeeDialog";
import Big from "big.js";
import { CurrencySelect } from "../../Selects/CurrencySelect";
import { useCurrenciesListWithoutPagination, useFetchDictionaries } from "@/hooks";

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
    variants?: Currency[];
    feeType?: FeeType;
}

export const AddFeeCard = ({ id, resource, onOpenChange, setFees, variants, feeType = "default" }: AddFeeCardProps) => {
    const { currenciesData, isCurrenciesLoading, currenciesLoadingProcess } = useCurrenciesListWithoutPagination();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();
    const data = useFetchDictionaries();
    const { isLoading } = useCreateController({ resource });

    const feeDataProvider = feesDataProvider({ id, resource });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [smallDialogOpen, setSmallDialogOpen] = useState(false);

    const formSchema = z
        .object({
            currency: z.optional(z.string()),
            value: z.preprocess(
                val => {
                    if (val === "" || val === null || val === undefined) return undefined;
                    return Number(val);
                },
                z
                    .number({
                        invalid_type_error: translate("resources.direction.fees.valueFieldError"),
                        required_error: translate("resources.direction.fees.valueFieldError")
                    })
                    .min(0, { message: translate("resources.direction.fees.valueMinError") })
                    .max(100, { message: translate("resources.direction.fees.valueMaxError") })
                    .refine(val => Number.isFinite(val), {
                        message: translate("resources.direction.fees.valueMustBeFinite")
                    })
                    .refine(val => Number(val.toFixed(2)) === val, {
                        message: translate("resources.direction.fees.valueMaxPrecisionError")
                    })
            ),
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

    const onSubmit = async () => {
        const tempData = form.getValues();
        if (!tempData) return;

        const accurateFeeAmount = new Big(tempData.value).div(100).toString();

        setSubmitButtonDisabled(true);
        if (feeType === "inner") {
            if (setFees) {
                setFees(prev => [
                    ...prev,
                    {
                        ...tempData,
                        value: accurateFeeAmount,
                        type: tempData.type,
                        direction: Number(tempData.direction),
                        recipient: resource === FeesResource.DIRECTION ? "provider_fee" : "merchant_fee",
                        innerId: new Date().getTime()
                    }
                ]);
                onOpenChange(false);
            }
            return;
        }
        const reqData: FeeCreate = {
            ...tempData,
            value: accurateFeeAmount,
            type: tempData.type,
            direction: Number(tempData.direction),
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
                if (error instanceof Error) {
                    appToast(
                        "error",
                        error.message.includes("already exists")
                            ? translate("resources.direction.fees.errorAlreadyExist")
                            : error.message
                    );
                } else {
                    appToast("error", translate("resources.direction.fees.errorWhenCreating"));
                }
            }
        }

        setSubmitButtonDisabled(false);
    };

    const onSubmitPreliminary = (data: z.infer<typeof formSchema>) => {
        if (data.value < 1) {
            setSmallDialogOpen(true);
        } else {
            onSubmit();
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
    const currenciesDisabled = useMemo(
        () =>
            !(currenciesData && Array.isArray(currenciesData) && currenciesData?.length > 0) ||
            typeValue !== IFeeType.NUMBER_3,
        [currenciesData, typeValue]
    );

    if (isLoading || isCurrenciesLoading)
        return (
            <div className="h-[320px]">
                <LoadingBlock />
            </div>
        );

    return (
        <>
            <Form {...form}>
                <form className="space-y-6">
                    <div className="mb-[16px]">
                        <div className="rounded-[8px] border border-neutral-40 bg-neutral-10 px-[8px] pb-[8px] pt-[16px] dark:border-none dark:bg-muted">
                            <div className="grid w-full grid-cols-2 sm:grid-cols-4">
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
                                                            {Object.entries(data?.transactionTypes || {}).map(el => {
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
                                {/* <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        onChange={() => {}}
                                                        label={translate("resources.direction.fees.feeAmount")}
                                                        labelSize="note-1"
                                                        error={fieldState.invalid}
                                                        errorMessage={<FormMessage />}
                                                        variant={InputTypes.GRAY}
                                                        borderColor="border-neutral-60"
                                                        className="max-w-[85%]"
                                                        inputMode="numeric"
                                                    />
                                                    <span className="absolute right-[15px] top-[50%]">%</span>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> */}
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 p-2">
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            value = value.replace(/[^0-9.]/g, "");
                                                            const parts = value.split(".");
                                                            if (parts.length > 2) {
                                                                value = parts[0] + "." + parts[1];
                                                            }
                                                            if (
                                                                value.length > 1 &&
                                                                value.startsWith("0") &&
                                                                !value.startsWith("0.")
                                                            ) {
                                                                value = value.replace(/^0+/, "") || "0";
                                                            }
                                                            if (value === ".") {
                                                                value = "0.";
                                                            }
                                                            field.onChange(value);
                                                        }}
                                                        value={field.value}
                                                        label={translate("resources.direction.fees.feeAmount")}
                                                        labelSize="note-1"
                                                        error={fieldState.invalid}
                                                        errorMessage={<FormMessage />}
                                                        variant={InputTypes.GRAY}
                                                        borderColor="border-neutral-60"
                                                        className="max-w-[85%]"
                                                        inputMode="decimal"
                                                        percentage
                                                    />
                                                </div>
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
                                                <CurrencySelect
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                    currencies={
                                                        !currenciesDisabled && !variants?.length
                                                            ? currenciesData || []
                                                            : (variants ?? [])
                                                    }
                                                    disabled={currenciesDisabled || currenciesLoadingProcess}
                                                    isError={fieldState.invalid}
                                                    errorMessage={<FormMessage />}
                                                    placeholder={
                                                        currenciesDisabled
                                                            ? typeValue !== IFeeType.NUMBER_3
                                                                ? translate(
                                                                      "resources.direction.errors.onlyThirdTypeError"
                                                                  )
                                                                : translate("resources.direction.noCurrencies")
                                                            : ""
                                                    }
                                                    modal
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="col-span-2 w-full p-2 sm:col-span-4">
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
            <div className="ml-auto flex w-full space-x-2 p-2 pb-5 md:w-2/5">
                <Button
                    onClick={form.handleSubmit(onSubmitPreliminary)}
                    variant="default"
                    className="flex-1"
                    disabled={submitButtonDisabled}>
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
            <SmallFeeDialog open={smallDialogOpen} onOpenChange={setSmallDialogOpen} onSubmit={onSubmit} />
        </>
    );
};
