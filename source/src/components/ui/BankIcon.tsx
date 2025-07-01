import { useQuery } from "@tanstack/react-query";

interface BankIconProps {
    logoURL: string;
}

async function fetchImage(logoURL: string) {
    const response = await fetch(logoURL);
    if (!response.ok) {
        return null;
    }
    return await response.blob();
}

export const BankIcon = ({ logoURL }: BankIconProps) => {
    const { data: blob, error } = useQuery({
        queryKey: ["image", logoURL],
        queryFn: () => fetchImage(logoURL),
        staleTime: Infinity, // Изображения никогда не устаревают
        gcTime: 30 * 24 * 60 * 60 * 1000 // 30 дней в кеше
        /* retry: 1,
        retryDelay: 1000 */
    });

    const objectUrl = blob && URL.createObjectURL(blob);

    return (
        <div className="h-[24px] w-[24px]">
            {!error && objectUrl && <img src={objectUrl} className={`h-full w-full object-contain`} />}
        </div>
    );
};
