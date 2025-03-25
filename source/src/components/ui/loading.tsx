import { useTheme } from "../providers";

export const InitLoading = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const bgImage = isDark ? 'url("/LoginBackground.svg")' : 'url("/LoginBackgroundLight.svg")';
    const bgColor = isDark ? "rgba(19, 35, 44, 1)" : "#f2f2f2";

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                backgroundImage: bgImage,
                backgroundColor: bgColor,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}>
            <RingSpinner />
        </div>
    );
};

export const Loading = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
            <RingSpinner />
        </div>
    );
};

export const LoadingBlock = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex h-full w-full items-center justify-center ${className}`}>
            <RingSpinner />
        </div>
    );
};

export const LoadingBalance = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <RingSpinner />
        </div>
    );
};
export const RingSpinner = () => {
    return (
        <svg className={`h-24 w-24 animate-spin`} viewBox="0 0 100 100">
            <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="28.01%" stopColor="#57CD8C" />
                    <stop offset="69.22%" stopColor="#57CD8C00" />
                </linearGradient>
            </defs>
            <circle
                className={`fill-none stroke-[url(#spinner-gradient)] stroke-[10px]`}
                cx="50"
                cy="50"
                r="45"
                strokeLinecap="round"
                strokeDasharray="282.7"
                strokeDashoffset="70.68"
            />
        </svg>
    );
};
