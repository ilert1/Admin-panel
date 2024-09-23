export const MessageTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return (
        <span className="text-xs text-neutral-500 mt-1">
            {hours}:{minutes} {amPm}
        </span>
    );
};
