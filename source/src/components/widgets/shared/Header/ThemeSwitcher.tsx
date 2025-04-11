import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/providers";
import { useTranslate } from "react-admin";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const translate = useTranslate();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div className="flex content-start items-center pl-4 pr-4">
            <Switch
                checked={theme === "light"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-green-60 data-[state=unchecked]:bg-muted dark:border-green-40"
            />

            <span className="ml-3 text-neutral-60 dark:text-neutral-50">
                {theme === "dark" ? translate("app.theme.light") : translate("app.theme.dark")}
            </span>
        </div>
    );
};
