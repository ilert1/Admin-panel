export const formatDateTime = (date: Date) => {
    const pad = (num: number, size = 2) => String(num).padStart(size, "0");
    if (!date) return "-";
    return (
        pad(date.getDate()) +
        "." +
        pad(date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        " " +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds()) +
        "." +
        pad(date.getMilliseconds(), 3)
    );
};
