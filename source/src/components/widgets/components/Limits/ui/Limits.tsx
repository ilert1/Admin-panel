import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CircleChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslate } from "react-admin";
import { LimitCard } from "./LimitCard";
import { AddLimitCard } from "./AddLimitCard";

interface LimitsProps {
    id: string;
    className?: string;
}

export const Limits = (props: LimitsProps) => {
    const { id, className } = props;

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

    return (
        <div className={cn("mt-[10px] w-full")}>
            <div className="flex flex-col bg-neutral-0 dark:bg-neutral-100 px-[32px] rounded-[8px] w-full ">
                <h3 className="text-display-3 mt-[16px] mb-[16px]">{translate("app.widgets.limits.limits")}</h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    <LimitCard />
                    <LimitCard />
                    <LimitCard />
                    <LimitCard />
                    {addNewOpen && <AddLimitCard id={id} />}
                    <div ref={containerEndRef} />
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => setAddNewOpen(true)} className="my-6 w-1/2 sm:w-1/4 flex gap-[4px]">
                    <CircleChevronRight className="w-[16px] h-[16px]" />
                    {translate("resources.direction.fees.addFee")}
                </Button>
            </div>
        </div>
    );
};
