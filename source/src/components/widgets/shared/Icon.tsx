import { useState } from "react";

export function Icon({ name, folder = "" }: { name: string; folder?: string }) {
    const [isImageError, setIsImageError] = useState(false);

    if (isImageError) {
        return <span className="text-green-40 text-display-4">{name}</span>;
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
