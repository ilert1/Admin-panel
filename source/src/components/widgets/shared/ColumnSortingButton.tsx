import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortingOrder = "ASC" | "DESC";
export type SortingState = { field: string; order: SortingOrder };

interface ISortingButton {
    title: string;
    order: SortingOrder | undefined;
    onChangeOrder: (order: SortingOrder) => void;
}

export const ColumnSortingButton = ({ title, order, onChangeOrder }: ISortingButton) => {
    return (
        <button onClick={() => onChangeOrder(order === "ASC" ? "DESC" : "ASC")} className="flex items-center gap-0.5">
            {title}

            <div className="relative h-6 w-6 cursor-pointer">
                <ChevronUp
                    size={18}
                    className={clsx("absolute -top-[3px] transition-colors", order === "DESC" && "text-green-40")}
                />
                <ChevronDown
                    size={18}
                    className={clsx("absolute -bottom-[3px] transition-colors", order === "ASC" && "text-green-40")}
                />
            </div>
        </button>
    );
};
