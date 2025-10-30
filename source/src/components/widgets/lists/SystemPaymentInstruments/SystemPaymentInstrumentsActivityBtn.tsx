import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsDataProvider } from "@/data/terminalPaymentInstruments";
import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDataProvider, useRefresh, useTranslate } from "react-admin";

interface SystemPaymentInstrumentsActivityBtnProps {
    id: string;
    systemPaymentInstrumentName: string;
    activityState: boolean;
    isFetching?: boolean;
}

export const SystemPaymentInstrumentsActivityBtn = ({
    id,
    systemPaymentInstrumentName,
    activityState,
    isFetching
}: SystemPaymentInstrumentsActivityBtnProps) => {
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const [currentState, setCurrentState] = useState(() => activityState);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const dataProvider = useDataProvider();

    useEffect(() => {
        if (currentState !== activityState) {
            setCurrentState(activityState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityState]);

    const changeActivity = async () => {
        const currentStateData = currentState ? "INACTIVE" : "ACTIVE";

        try {
            setBtnDisabled(true);

            await dataProvider.update("systemPaymentInstruments", {
                id,
                data: { status: currentStateData },
                previousData: undefined
            });

            appToast(
                "success",
                translate("resources.paymentSettings.systemPaymentInstruments.success.editActivity", {
                    name: systemPaymentInstrumentName,
                    state: translate(`resources.paymentSettings.terminalPaymentInstruments.success.${currentStateData}`)
                })
            );

            refresh();
        } catch (error) {
            appToast("error", translate("app.ui.edit.editError"));
        } finally {
            setBtnDisabled(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
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
                        currentState ? "translate-x-full" : "translate-x-0"
                    )}>
                    {currentState ? (
                        <LockKeyholeOpen className="h-[15px] w-[15px] text-green-50" />
                    ) : (
                        <LockKeyhole className="h-[15px] w-[15px] text-red-40" />
                    )}
                </span>
            </button>
        </div>
    );
};
