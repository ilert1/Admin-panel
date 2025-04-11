import { FeesResource } from "@/data";
import { useEffect, useRef, useState } from "react";
import { FeeCard } from "./FeeCard";
import { AddFeeCard, FeeType } from "./AddFeeCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { useTranslate } from "react-admin";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { DirectionFees, FeeCreate, MerchantFees } from "@/api/enigma/blowFishEnigmaAPIService.schemas";

interface FeesProps {
    className?: string;
    id: string;
    addFee?: boolean;
    fees?: FeeCreate[] | MerchantFees | DirectionFees;
    setFees?: React.Dispatch<React.SetStateAction<(FeeCreate & { innerId?: number })[]>>;
    feesResource?: FeesResource;
    feesVariants?: string[];
    padding?: boolean;
    feeType?: FeeType;
    providerName?: string;
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
        providerName,
        setFees
    } = props;

    const data = fetchDictionaries();
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
            setFees(prev => prev.filter(el => el.innerId === innerId));
        }
    };

    if (!feeTypes) {
        return null;
    }
    console.log(fees);

    return (
        <div className={cn("mt-[10px] w-full", padding ? "px-2" : "px-0")}>
            <div className="flex w-full flex-col rounded-[8px] bg-neutral-0 px-[32px] dark:bg-neutral-100">
                <h3 className="mb-[16px] mt-[16px] text-display-3">{translate("resources.direction.fees.fees")}</h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {fees && Object.keys(fees).length !== 0
                        ? Object.keys(fees).map(key => {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              const fee = fees[key];
                              return (
                                  <FeeCard
                                      key={fee.innerId ?? fee.id}
                                      isInner={fee.innerId ?? false}
                                      deleteFn={deleteFee}
                                      account={fee.id ?? ""}
                                      feeAmount={
                                          feeType === "inner" ? fee.value : fee.value.quantity / fee.value.accuracy
                                      }
                                      feeType={fee.type}
                                      id={id}
                                      resource={feesResource}
                                      description={fee.description}
                                      addFee={addFee}
                                      providerName={providerName}
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
                            providerName={providerName}
                        />
                    )}
                    <div ref={containerEndRef} />
                </div>
            </div>
            {addFee && (
                <div className="flex justify-end">
                    <Button onClick={() => setAddNewOpen(true)} className="my-6 flex w-full gap-[4px] sm:w-2/5">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        {translate("resources.direction.fees.addFee")}
                    </Button>
                </div>
            )}
        </div>
    );
};
