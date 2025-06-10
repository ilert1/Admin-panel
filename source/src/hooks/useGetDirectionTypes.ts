import { useTranslate } from "react-admin";

export const useGetDirectionTypes = () => {
    const translate = useTranslate();

    const directionTypes = [
        // { value: "universal", translation: translate("resources.direction.types.universal") },
        { value: "withdraw", translation: translate("resources.direction.types.withdraw") },
        { value: "deposit", translation: translate("resources.direction.types.deposit") }
    ];

    return { directionTypes };
};
