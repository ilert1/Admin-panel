export function AZNIcon({ className = "" }: { className?: string }) {
    return (
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.67621 17H1C2.42201 8.91029 3.41808 4.61576 10.1877 3.0109V1H13.8381V3.0109C20.1899 5.1355 21.8809 8.57757 23 17L19.3352 16.9625C18.508 10.3901 17.6614 7.34399 13.8381 5.81002V17H10.1877V5.81002C6.16648 7.80764 5.36109 10.7689 4.67621 17Z"
                className={className ? className : "stroke-controlElements"}
                strokeLinejoin="round"
            />
        </svg>
    );
}
