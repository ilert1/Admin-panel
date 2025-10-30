import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalPaymentInstrumentsDataProvider } from "@/data/terminalPaymentInstruments";
import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

interface ITerminalPaymentInstrumentsActivityBtn {
    id: string;
    terminalPaymentInstrumentName: string;
    activityState: boolean;
    isFetching?: boolean;
}

export const TerminalPaymentInstrumentsActivityBtn = ({
    id,
    terminalPaymentInstrumentName,
    activityState,
    isFetching
}: ITerminalPaymentInstrumentsActivityBtn) => {
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const [currentState, setCurrentState] = useState(() => activityState);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const terminalPaymentInstrumentsProvider = new TerminalPaymentInstrumentsDataProvider();

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

            await terminalPaymentInstrumentsProvider.update("terminalPaymentInstruments", {
                id,
                data: { status: currentStateData },
                previousData: undefined
            });

            appToast(
                "success",
                translate("resources.paymentSettings.terminalPaymentInstruments.success.editActivity", {
                    name: terminalPaymentInstrumentName,
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
    ``;
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

                        // currentState ? "translate-x-0" : "translate-x-full"
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
