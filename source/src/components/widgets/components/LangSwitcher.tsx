import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { LanguagesIcon } from "lucide-react";
import { useI18nProvider, useLocaleState } from "react-admin";
import { useState } from "react";

export const LangSwitcher = () => {
    const [locale, setLocale] = useLocaleState();
    const changeLocale = (value: string) => {
        if (locale !== value) {
            localStorage.setItem("i18nextLng", value);
            setLocale(value);
        }
    };
    const [langOpen, setLangOpen] = useState(false);
    const { getLocales } = useI18nProvider();

    return (
        <DropdownMenu onOpenChange={setLangOpen}>
            <DropdownMenuTrigger asChild className="">
                <Avatar
                    className={
                        langOpen
                            ? "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-100 border-2 border-green-50 bg-green-50 transition-colors duration-150"
                            : "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-50 hover:text-neutral-100 border-2 border-neutral-50 hover:border-green-50 bg-muted hover:bg-green-50 transition-colors duration-150"
                    }>
                    <LanguagesIcon className="h-[30px] w-[30px]" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-0 bg-muted border border-neutral-100 z-[60]">
                {getLocales?.().map(locale => (
                    <DropdownMenuItem
                        key={locale.locale}
                        onClick={() => changeLocale(locale.locale)}
                        className="text-title-2 py-[14px] focus:bg-green-50 focus:cursor-pointer pl-4 pr-4">
                        {locale.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
