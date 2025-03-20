import { useGetResourceHeaderData } from "@/hooks/useGetResourceHeaderData";
import { cn } from "@/lib/utils";

export const ResourceHeaderTitle = ({ marginBottom = false }: { marginBottom?: boolean }) => {
    const { pageTitle, resourceName } = useGetResourceHeaderData();

    return (
        resourceName[0] !== "bank-transfer" &&
        resourceName[0] !== "error" && (
            <h1 className={cn("text-3xl text-neutral-90 dark:text-white", marginBottom && "mb-6")}>{pageTitle}</h1>
        )
    );
};
