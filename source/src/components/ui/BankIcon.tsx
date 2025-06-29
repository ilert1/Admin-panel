import { useState } from "react";
import { LoadingBalance } from "./loading";

interface BankIconProps {
    logoURL: string;
}

export const BankIcon = ({ logoURL }: BankIconProps) => {
    return (
        <div className="h-[24px] w-[24px]">
            <img src={logoURL} loading="lazy" className={`h-full w-full object-contain`} />
        </div>
    );
};
