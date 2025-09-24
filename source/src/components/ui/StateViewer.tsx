import clsx from "clsx";
import { useTranslate } from "react-admin";

export type localStates = "active" | "inactive" | "archived";

interface IStateViewer {
    value: localStates;
    className?: string;
}

export const StateViewer = ({ value, className = "" }: IStateViewer) => {
    const translate = useTranslate();

    return (
        <span
            className={clsx(
                "cursor-default whitespace-nowrap rounded-20 px-3 py-0.5 text-center text-title-2 font-normal text-neutral-0 dark:text-neutral-0",
                value === "active" && "bg-green-50",
                value === "inactive" && "bg-red-50",
                value === "archived" && "bg-extra-2",
                className
            )}>
            {translate(`resources.cascadeSettings.cascades.state.${value}`)}
        </span>
    );
};
