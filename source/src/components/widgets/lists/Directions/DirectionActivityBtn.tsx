import { Direction } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";

interface IDirectionActivityBtn {
    id: string;
    directionName: string;
    activityState: boolean;
    isFetching: boolean;
}

export const DirectionActivityBtn = ({ id, directionName, activityState, isFetching }: IDirectionActivityBtn) => {
    const dataProvider = useDataProvider();
    const appToast = useAppToast();
    const translate = useTranslate();

    const [currentState, setCurrentState] = useState(() => activityState);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const changeActivity = async () => {
        const tempStateActivity = currentState;

        try {
            setCurrentState(!tempStateActivity);
            setBtnDisabled(true);

            await dataProvider.update<Direction>("direction", {
                id,
                data: { state: tempStateActivity ? "inactive" : "active" },
                previousData: undefined
            });

            appToast(
                "success",
                translate("resources.direction.success.editActivity", {
                    name: directionName,
                    state: translate(`resources.direction.success.${tempStateActivity ? "inactive" : "active"}`)
                })
            );
        } catch (error) {
            setCurrentState(tempStateActivity);
            appToast("error", translate("app.ui.edit.editError"));
        } finally {
            setBtnDisabled(false);
        }
    };

    return (
        <button
            disabled={btnDisabled || isFetching}
            onClick={changeActivity}
            className={clsx(
                "flex h-[27px] w-[50px] cursor-pointer items-center rounded-20 border-none p-0.5 outline-none transition-colors disabled:grayscale",
                currentState ? "bg-green-50" : "bg-red-40"
            )}>
            <span
                className={clsx(
                    "flex h-[23px] w-[23px] items-center justify-center rounded-full bg-white p-1 transition-transform",
                    currentState ? "translate-x-0" : "translate-x-full"
                )}>
                {currentState ? (
                    <LockKeyholeOpen className="h-[15px] w-[15px] text-green-50" />
                ) : (
                    <LockKeyhole className="h-[15px] w-[15px] text-red-40" />
                )}
            </span>
        </button>
    );
};
