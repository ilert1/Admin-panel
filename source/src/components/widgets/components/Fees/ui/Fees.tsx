import { FeesResource } from "@/data";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useTranslate } from "react-admin";
import { Currency, DirectionFees, FeeCreate, MerchantFees } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { AddFeeCard, FeeType } from "./AddFeeCard";
import { FeeCard } from "./FeeCard";
import { useFetchDictionaries } from "@/hooks";

interface FeesProps {
    className?: string;
    id: string;
    addFee?: boolean;
    fees?: FeeCreate[] | MerchantFees | DirectionFees;
    setFees?: React.Dispatch<React.SetStateAction<(FeeCreate & { innerId?: number })[]>>;
    feesResource?: FeesResource;
    feesVariants?: Currency[];
    padding?: boolean;
    feeType?: FeeType;
}

export const Fees = (props: FeesProps) => {
    const {
        className,
        addFee = true,
        fees,
        id,
        feesResource = FeesResource.MERCHANT,
        feesVariants = [],
        padding = true,
        feeType = "default",
        setFees
    } = props;

    const data = useFetchDictionaries();
    const feeTypes = data?.feeTypes;
    const containerEndRef = useRef<HTMLDivElement>(null);
    const translate = useTranslate();

    const [addNewOpen, setAddNewOpen] = useState(false);

    useEffect(() => {
        if (addNewOpen && containerEndRef.current) {
            const parent = containerEndRef.current.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const childRect = containerEndRef.current.getBoundingClientRect();

                if (childRect.bottom > parentRect.bottom) {
                    containerEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        }
    }, [addNewOpen]);

    const deleteFee = (innerId: number) => {
        if (setFees) {
            setFees(prev => prev.filter(el => el.innerId !== innerId));
        }
    };

    if (!feeTypes) {
        return null;
    }

    const isFeeCreateArray = Array.isArray(fees) && fees.every(fee => "type" in fee);

    return (
        <div className={cn("mt-[10px] w-full", padding ? "px-2" : "px-0")}>
            <div className="flex w-full flex-col rounded-[8px] bg-neutral-0 px-[32px] dark:bg-neutral-100">
                <h3 className="mb-[16px] mt-[16px] text-display-3 text-neutral-90 dark:text-neutral-0">
                    {translate("resources.direction.fees.fees")}
                </h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {fees && Object.keys(fees).length !== 0
                        ? Object.keys(fees).map(key => {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              const fee = fees[key];
                              return (
                                  <FeeCard
                                      key={fee.innerId ?? fee.id}
                                      isInner={fee.innerId ? true : false}
                                      deleteFn={deleteFee}
                                      account={fee.id ?? ""}
                                      feeAmount={
                                          feeType === "inner" ? fee.value : fee.value.quantity / fee.value.accuracy
                                      }
                                      feeType={fee.type}
                                      id={fee.innerId ? fee.innerId : id}
                                      resource={feesResource}
                                      description={fee.description}
                                      addFee={addFee}
                                      currency={fee.currency}
                                      direction={fee.direction}
                                  />
                              );
                          })
                        : ""}
                    {addNewOpen && (
                        <AddFeeCard
                            id={id}
                            onOpenChange={setAddNewOpen}
                            resource={feesResource}
                            variants={id ? feesVariants : undefined}
                            setFees={setFees ?? undefined}
                            feeType={feeType}
                            // eslint-disable-next-line
                            // @ts-ignore
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            fees={isFeeCreateArray ? fees : Object.values(fees ?? {}).map(({ id, ...rest }) => rest)}
                        />
                    )}
                    <div ref={containerEndRef} />
                </div>
            </div>
            {addFee && (
                <div className="flex justify-end">
                    <Button
                        onClick={() => setAddNewOpen(true)}
                        className="my-6 flex w-full gap-[4px] sm:w-2/5"
                        disabled={isFeeCreateArray ? fees?.length > 2 : Object.values(fees ?? {}).length > 2}>
                        <PlusCircle className="h-[16px] w-[16px]" />
                        {translate("resources.direction.fees.addFee")}
                    </Button>
                </div>
            )}
        </div>
    );
};
