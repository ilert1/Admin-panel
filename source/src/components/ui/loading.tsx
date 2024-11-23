export const InitLoading = () => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                backgroundImage: 'url("/LoginBackground.png")',
                backgroundColor: "rgba(19, 35, 44, 1)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}>
            <RingSpinner />
        </div>
    );
};

export const Loading = ({ className }: { className?: string }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center ${className}`}>
            <RingSpinner />
        </div>
    );
};

export const LoadingAlertDialog = ({ className }: { className?: string }) => {
    return (
        <div className={`flex justify-center items-center h-full w-full ${className}`}>
            <RingSpinner />
        </div>
    );
};
export const RingSpinner = () => {
    return (
        <svg className={`animate-spin w-24 h-24`} viewBox="0 0 100 100">
            <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="28.01%" stopColor="#57CD8C" />
                    <stop offset="69.22%" stopColor="#237648" />
                </linearGradient>
            </defs>
            <circle
                className={`stroke-[10px] fill-none stroke-[url(#spinner-gradient)]`}
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
