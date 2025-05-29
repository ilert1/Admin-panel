import { useAppToast } from "@/components/ui/toast/useAppToast";
import { FinancialInstitutionProvider } from "@/data/financialInstitution";
import clsx from "clsx";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRefresh, useTranslate } from "react-admin";

interface IFinancialInstitutionActivityBtn {
    id: string;
    financialInstitutionName: string;
    activityState: boolean;
    isFetching?: boolean;
}

export const FinancialInstitutionActivityBtn = ({
    id,
    financialInstitutionName,
    activityState,
    isFetching
}: IFinancialInstitutionActivityBtn) => {
    const appToast = useAppToast();
    const refresh = useRefresh();
    const translate = useTranslate();

    const [currentState, setCurrentState] = useState(() => activityState);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const financialInstitutionProvider = new FinancialInstitutionProvider();

    useEffect(() => {
        if (currentState !== activityState) {
            setCurrentState(activityState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityState]);

    const changeActivity = async () => {
        const tempStateActivity = currentState;

        try {
            setBtnDisabled(true);

            await financialInstitutionProvider.update("financialInstitution", {
                id,
                data: { status: tempStateActivity ? "INACTIVE" : "ACTIVE" },
                previousData: undefined
            });

            appToast(
                "success",
                translate("resources.paymentTools.financialInstitution.success.editActivity", {
                    name: financialInstitutionName,
                    state: translate(
                        `resources.paymentTools.financialInstitution.success.${tempStateActivity ? "INACTIVE" : "ACTIVE"}`
                    )
                })
            );

            refresh();
        } catch (error) {
            setCurrentState(tempStateActivity);
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
                        currentState ? "translate-x-0" : "translate-x-full"
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
