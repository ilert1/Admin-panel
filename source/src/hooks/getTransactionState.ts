import { useTranslate } from "react-admin";
import { useFetchDictionaries } from "./useFetchDictionaries";

interface UseGetTransactionStateProps {
    state: number | undefined;
}

//TODO: переделать после доработки словарей

const stateColors: Record<number, string> = {
    [16]: "bg-green-50", // Success
    [12]: "bg-extra-2", // Processing
    [13]: "bg-yellow-30" // expired
};

const getBadgeColor = (state: number) => {
    if (stateColors[state]) {
        return stateColors[state];
    }

    if (state >= 18) {
        return "bg-orange-40";
    }

    if (state >= 0 && state <= 11) {
        return "bg-yellow-30";
    }

    return "bg-red-50";
};

export const useGetTransactionState = (props: UseGetTransactionStateProps) => {
    const { state } = props;
    const data = useFetchDictionaries();
    const translate = useTranslate();

    if (!data || !state) {
        return {
            text: "",
            color: "bg-neutral-0 dark:bg-neutral-100"
        };
    }

    return {
        text: translate(`resources.transactions.states.${data.states[state].state_description?.toLocaleLowerCase()}`),
        color: getBadgeColor(state)
    };
};
