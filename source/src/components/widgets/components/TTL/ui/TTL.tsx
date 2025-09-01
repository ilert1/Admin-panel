import { cn } from "@/lib/utils";
import { useTranslate } from "react-admin";
import { TTLCard } from "./TTLCard";
import { EditTTLCard } from "./EditTTLCard";

interface TTLProps {
    id?: string;
    ttl: {
        depositMin: number;
        depositMax: number;
        withdrawMin: number;
        withdrawMax: number;
    };
    className?: string;
    onChange?: (value: { depositMin: number; depositMax: number; withdrawMin: number; withdrawMax: number }) => void;
    editClicked: boolean;
    setEditClicked: (state: boolean) => void;
}

export const TTL = (props: TTLProps) => {
    const { id, ttl, className, onChange, editClicked, setEditClicked } = props;
    const translate = useTranslate();

    return (
        <div className={cn("mt-[10px] w-full px-2")}>
            <div className="p flex w-full flex-col rounded-[8px] bg-neutral-0 px-[32px] dark:bg-neutral-100">
                <h3 className="mb-[16px] mt-[16px] text-display-3 text-neutral-90 dark:text-neutral-0">
                    {translate("app.widgets.ttl.ttl")}
                </h3>
                <div className={cn("max-h-[40vh] overflow-auto pr-[10px]", className)}>
                    {editClicked ? (
                        <EditTTLCard id={id} setEditClicked={setEditClicked} ttl={ttl} onChange={onChange} />
                    ) : (
                        <TTLCard ttl={ttl} setEditClicked={setEditClicked} />
                    )}
                </div>
            </div>
        </div>
    );
};
