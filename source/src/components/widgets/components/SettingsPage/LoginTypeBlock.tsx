import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import QRExample from "@/lib/icons/QRexample.svg?react";
import { useState } from "react";
import { useTranslate } from "react-admin";

type RadioValueType = "passOnly" | "passAndOtp";

export const LoginTypeBlock = () => {
    const translate = useTranslate();

    const [radioValue, setRadioValue] = useState<RadioValueType>("passOnly");

    return (
        <div className="w-[585px] max-h-[397px] bg-white dark:bg-black rounded-16 p-[30px] flex flex-col gap-[20px]">
            <h4 className="w-full text-center text-display-4">{translate("pages.settings.login.loginMethod")}</h4>
            <RadioGroup defaultValue={radioValue} onValueChange={(e: RadioValueType) => setRadioValue(e)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passOnly" id="option-one" />
                    <Label htmlFor="option-one" className="mb-0 text-title-1 dark:!text-neutral-40">
                        {translate("pages.settings.login.withPassword")}
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passAndOtp" id="option-two" />
                    <Label htmlFor="option-two" className="mb-0 text-title-1 dark:!text-neutral-40">
                        {translate("pages.settings.login.withPassAndOtp")}
                    </Label>
                </div>
            </RadioGroup>
            {radioValue === "passAndOtp" && (
                <div className="w-full h-[209px] bg-neutral-bb rounded-16 px-[8px] py-[7px] flex gap-[12px]">
                    <span className="text-body text-green-40">{translate("pages.settings.login.scanQr")}</span>
                    <div className="w-[195px] h-[195px]">
                        <QRExample className="rounded-16" />
                    </div>
                </div>
            )}
        </div>
    );
};
