import clsx from "clsx";
import { Dispatch, MouseEvent, SetStateAction } from "react";

interface IAuthDataJsonToggle {
    showJson: boolean;
    setShowJson: Dispatch<SetStateAction<boolean>>;
}

export const AuthDataJsonToggle = ({ showJson, setShowJson }: IAuthDataJsonToggle) => {
    const toggleJsonHandler = (e: MouseEvent) => {
        e.preventDefault();
        setShowJson(prev => !prev);
    };

    return (
        <label className="flex items-center gap-2">
            <button
                onClick={toggleJsonHandler}
                className={clsx(
                    "flex w-11 items-center rounded-[50px] p-0.5 outline outline-1",
                    showJson
                        ? "bg-neutral-100 outline-transparent dark:bg-green-50 dark:outline-green-40"
                        : "bg-transparent outline-green-40 dark:outline-green-50"
                )}>
                <span
                    className={clsx(
                        "h-5 w-5 rounded-full outline outline-1 transition-all",
                        showJson
                            ? "translate-x-full bg-neutral-0 outline-transparent dark:bg-neutral-100 dark:outline-green-40"
                            : "translate-x-0 bg-green-50 outline-green-40 dark:bg-green-50 dark:outline-transparent"
                    )}
                />
            </button>
            <p className="text-base text-neutral-90 dark:text-neutral-30">JSON</p>
        </label>
    );
};
