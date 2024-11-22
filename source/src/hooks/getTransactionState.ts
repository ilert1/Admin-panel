import { useTranslate } from "react-admin";

interface UseGetTransactionStateProps {
    state: number;
}
const states = [
    "Created",
    "Paid",
    "FromOutside",
    "WaitPayout",
    "PaidOut",
    "ToReturnFromInside",
    "ToReturnFromOutside",
    "Reversed",
    "ChangedFromCreated",
    "ChangedFromPaid",
    "Returned",
    "ToDeny",
    "Processing",
    "Expired",
    "Deleted",
    "Success",
    "Fail",
    "Correction",
    "EmptyRequisites",
    "LimitFail",
    "CancelledByPayer"
];

const getBadgeColor = (state: number) => {
    if (state === 16) {
        return "bg-green-50";
    }

    if ((state >= 0 && state <= 11) || state === 13) {
        return "bg-yellow-30";
    }

    if (state >= 18) {
        return "bg-orange-40";
    }

    return "bg-red-50";
};

export const useGetTransactionState = (props: UseGetTransactionStateProps) => {
    const { state } = props;
    const translate = useTranslate();

    return {
        text: translate(`resources.transactions.states.${states[state - 1].toLowerCase()}`),
        color: getBadgeColor(state)
    };
};
