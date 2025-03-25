import { useTranslate } from "react-admin";

import { GeneralInfo } from "@/components/widgets/components/SettingsPage/GeneralInfo";
// import { LoginTypeBlock } from "@/components/widgets/components/SettingsPage/LoginTypeBlock";

export const OptionsPage = () => {
    const translate = useTranslate();

    return (
        <>
            <h1 className="mb-6 text-3xl text-neutral-90 dark:text-white">{translate("app.ui.header.settings")}</h1>
            <div className="flex w-full flex-col items-center justify-center gap-[12px]">
                <GeneralInfo />
                {/* <LoginTypeBlock /> */}
            </div>
        </>
    );
};
