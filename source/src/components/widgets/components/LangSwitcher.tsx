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
            <DropdownMenuTrigger asChild className="select-none">
                <Avatar
                    className={cn(
                        "flex h-[60px] w-[60px] cursor-pointer items-center justify-center border-2 text-neutral-50",
                        langOpen
                            ? "border-green-20 bg-green-0 dark:border-neutral-20 dark:bg-muted dark:text-neutral-50"
                            : "border-neutral-50 bg-white hover:border-green-20 dark:bg-muted dark:hover:bg-green-50"
                    )}>
                    <span className="text-display-3 transition-colors duration-150">{locale.toUpperCase()}</span>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="z-[60] border border-green-20 bg-muted p-0 dark:border-neutral-20">
                {getLocales?.().map(locale => (
                    <DropdownMenuItem
                        key={locale.locale}
                        onClick={() => changeLocale(locale.locale)}
                        className="bg-neutral-0 py-[14px] pl-4 pr-4 text-title-2 hover:!text-neutral-0 focus:cursor-pointer focus:bg-green-50 focus:!text-neutral-0 dark:bg-muted dark:focus:bg-green-50">
                        {locale.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
