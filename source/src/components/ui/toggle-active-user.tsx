import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

export const ToggleActiveUser = ({ active }: { active: boolean }) => {
    return (
        <div className={clsx("flex w-[50px] items-center rounded-20 bg-green-50 p-0.5", !active && "bg-red-40")}>
            <div
                className={clsx(
                    "flex items-center justify-center rounded-full bg-neutral-0 p-1",
                    !active && "ml-auto"
                )}>
                {active ? (
                    <LockKeyholeOpen size={15} className="text-green-50" />
                ) : (
                    <LockKeyhole size={15} className="text-red-40" />
                )}
            </div>
        </div>
    );
};
