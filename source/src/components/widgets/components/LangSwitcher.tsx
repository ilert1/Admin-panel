import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { useI18nProvider, useLocaleState } from "react-admin";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
                    className={cn(
                        "cursor-pointer w-[60px] h-[60px] flex items-center justify-center text-neutral-50 border-2 transition-colors duration-150",
                        langOpen
                            ? "dark:text-neutral-100 border-green-20 bg-green-0 dark:bg-green-50"
                            : "dark:hover:text-neutral-100 border-neutral-50 hover:border-green-20 bg-white dark:bg-muted dark:hover:bg-green-50"
                    )}>
                    <span className="text-display-3">{locale.toUpperCase()}</span>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="p-0 bg-muted border border-green-20 dark:border-neutral-80 z-[60] ">
                {getLocales?.().map(locale => (
                    <DropdownMenuItem
                        key={locale.locale}
                        onClick={() => changeLocale(locale.locale)}
                        className="text-title-2 py-[14px] focus:bg-green-50 focus:cursor-pointer pl-4 pr-4 hover:!text-neutral-0">
                        {locale.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
