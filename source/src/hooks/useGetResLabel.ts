import { useTranslate } from "react-admin";

export const useGetResLabel = (): ((resource: string, role?: string, count?: number) => string) => {
    const translate = useTranslate();
    return (resource: string, role = "", count = 2): string => {
        const isPermDependent = translate(`resources.${resource}.name`) === `resources.${resource}.name`;
        const label = translate(
            `resources.${resource}.${isPermDependent ? (role === "admin" ? "admin." : "merchant.") : ""}name`
        );

        return label;
    };
};

export type GetResourceLabel = (resource: string, count?: number) => string;
