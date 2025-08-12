import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

interface IUniqunessActivityButton {
    id: string;
    directionName: string;
    activityState: boolean;
    setActivityState: (state: boolean) => void;
    isFetching?: boolean;
    disabled?: boolean;
    setIsSomethingEdited: (state: boolean) => void;
}

export const UniqunessActivityButton = ({
    activityState,
    setActivityState,
    isFetching,
    disabled,
    setIsSomethingEdited
}: IUniqunessActivityButton) => {
    const changeActivity = () => {
        setActivityState(!activityState);
        setIsSomethingEdited?.(true);
    };

    return (
        <div className="flex items-center justify-center">
            <button
                disabled={isFetching || disabled}
                type="button"
                onClick={changeActivity}
                className={clsx(
                    "flex h-[27px] w-[50px] cursor-pointer items-center rounded-20 border-none p-0.5 outline-none transition-colors disabled:grayscale",
                    activityState ? "bg-green-50" : "bg-red-40"
                )}>
                <span
                    className={clsx(
                        "flex h-[23px] w-[23px] items-center justify-center rounded-full bg-white p-1 transition-transform",
                        activityState ? "translate-x-full" : "translate-x-0"
                    )}>
                    {activityState ? (
                        <LockKeyholeOpen className="h-[15px] w-[15px] text-green-50" />
                    ) : (
                        <LockKeyhole className="h-[15px] w-[15px] text-red-40" />
                    )}
                </span>
            </button>
        </div>
    );
};
