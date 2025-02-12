import { FeesResource } from "@/data";
import { Dispatch, memo, SetStateAction, useEffect, useRef } from "react";
import { FeeCard } from "./FeeCard";
import { AddFeeCard } from "./AddFeeCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CircleChevronRight } from "lucide-react";
import { useTranslate } from "react-admin";

interface FeesProps {
    className?: string;
    id: string;
    addFee?: boolean;
    fees?: Directions.Fees | Directions.FeeCreate[];
    setFees?: Dispatch<SetStateAction<Directions.FeeCreate[]>>;
    feeTypes: Dictionaries.FeeTypes;
    feesResource?: FeesResource;
    feesVariants?: string[];
    addNewOpen?: boolean;
    setAddNewOpen?: (state: boolean) => void;
    padding?: boolean;
}
export const Fees = memo((props: FeesProps) => {
    const {
        className,
        addFee = true,
        fees,
        id,
        feeTypes,
        feesResource = FeesResource.MERCHANT,
        addNewOpen = false,
        feesVariants = [],
        padding = true,
        setAddNewOpen = () => {},
        setFees
    } = props;

    const containerEndRef = useRef<HTMLDivElement>(null);
    const translate = useTranslate();

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

    return (
        <div className={cn("mt-[10px] w-full", padding ? "px-2" : "px-0")}>
            <div className="flex flex-col bg-neutral-0 dark:bg-neutral-100 px-[32px] rounded-[8px] w-full ">
                <h3 className="text-display-3 mt-[16px] mb-[16px]">{translate("resources.direction.fees.fees")}</h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {fees && Object.keys(fees).length !== 0
                        ? Object.keys(fees).map((key: any) => {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              const fee = fees[key];
                              return (
                                  <FeeCard
                                      key={fee.id}
                                      account={fee.id ?? ""}
                                      currency={fee.currency}
                                      feeAmount={fee.value.quantity / fee.value.accuracy}
                                      feeType={feeTypes[fee.type]?.type_descr || ""}
                                      id={id}
                                      resource={feesResource}
                                      description={fee.description}
                                      addFee={addFee}
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
                        />
                    )}
                    <div ref={containerEndRef} />
                </div>
            </div>
            {addFee && (
                    <div className="flex justify-end">
                        <Button onClick={() => setAddNewOpen(true)} className="my-6 w-1/2 sm:w-1/4 flex gap-[4px]">
                            <CircleChevronRight className="w-[16px] h-[16px]" />
                            {translate("resources.direction.fees.addFee")}
                        </Button>
                    </div>
                )}
        </div>
    );
});

Fees.displayName = "Fees";
