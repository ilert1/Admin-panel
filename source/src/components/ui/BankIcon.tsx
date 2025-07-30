import { useQuery } from "@tanstack/react-query";
import { authProvider } from "../providers";

interface BankIconProps {
    logoURL: string;
}

async function fetchImage(checkAuth: typeof authProvider.checkAuth, logoURL: string) {
    await checkAuth({});
    const response = await fetch(logoURL);
    if (!response.ok) {
        return null;
    }
    return await response.blob();
}

export const BankIcon = ({ logoURL }: BankIconProps) => {
    const { checkAuth } = authProvider;

    const { data: blob, error } = useQuery({
        queryKey: ["image", logoURL],
        queryFn: () => fetchImage(checkAuth, logoURL),
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
