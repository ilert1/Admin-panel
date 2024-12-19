import { useState } from "react";

export function Icon({ name, folder = "", textSmall = false }: { name: string; folder?: string; textSmall?: boolean }) {
    const [isImageError, setIsImageError] = useState(false);

    if (isImageError) {
        return <span className={`text-green-40 ${textSmall ? "" : "text-display-4"} overflow-hidden`}>{name}</span>;
    }

    return (
        <img
            src={(folder && `/${folder}/`) + name + ".svg"}
            alt={name}
            onError={e => {
                e.currentTarget.style.display = "none";
                setIsImageError(true);
            }}
        />
    );
}
