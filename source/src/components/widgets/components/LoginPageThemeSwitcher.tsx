import SunIcon from "@/lib/icons/Sun.svg?react";
import MoonIcon from "@/lib/icons/Moon.svg?react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Translate } from "react-admin";
import { ThemeProviderState } from "@/components/providers/ThemeProvider";

interface LoginPageThemeSwitcherProps extends ThemeProviderState {
    translate: Translate;
}
export const LoginPageThemeSwitcher = (props: LoginPageThemeSwitcherProps) => {
    const { theme, setTheme, translate } = props;

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div
            className="flex border border-neutral-50 rounded-full items-center bg-white dark:bg-black relative w-[140px] h-[60px] overflow-hidden cursor-pointer z-[-2]"
            onClick={toggleTheme}>
            <div className="absolute w-full h-full flex items-center gap-0">
                <div className="flex items-center">
                    <div
                        className={cn(
                            "absolute rounded-full bg-neutral-50 overflow-hidden m-[5px] mr-0 duration-500 opacity:duration-0 z-1 ease-in-out",
                            theme === "dark" ? "translate-x-0 ml-[7px] opacity-100" : "translate-x-[160%] opacity-0"
                        )}
                        style={{
                            boxShadow: "0px 0px 16px rgba(255, 2555, 255, 0.75)"
                        }}>
                        <MoonIcon className="shadow-1 z-2" />
                    </div>
                    <div
                        className={cn(
                            "rounded-full overflow-hidden cursor-pointer ml-0 duration-500 opacity:duration-0 z-1 ease-in-out",
                            theme === "dark" ? "translate-x-[15%] opacity-0" : "translate-x-[165%] opacity-100"
                        )}>
                        <SunIcon
                            style={{
                                boxShadow: "0px 0px 12px rgba(241, 197, 42, 0.75)",
                                borderRadius: "50%",
                                border: "0"
                            }}
                            className="shadow-1 z-2"
                        />
                    </div>
                </div>
                <div
                    className={cn(
                        "flex items-center justify-end w-full h-full ml-1 z-[-1]",
                        theme === "dark" ? "translate-x-0" : "-translate-x-[60%]"
                    )}>
                    <Text
                        text={translate("app.login.darkTheme")}
                        className={cn(
                            "absolute px-[13px] py-[16px] !text-title-2 text-neutral-90 dark:text-neutral-0 text-center w-full z-[-1] select-none ease-in-out",
                            theme === "dark"
                                ? "opacity-100 opacity:duration-0"
                                : "opacity-0 translate-x-[0%] opacity:duration-200"
                        )}
                    />
                    <Text
                        text={translate("app.login.lightTheme")}
                        className={cn(
                            "absolute px-[13px] py-[16px] !text-title-2 text-neutral-90 dark:text-neutral-0 text-center w-full z-[-1] select-none ease-in-out",
                            theme === "dark"
                                ? "opacity-0 -translate-x-[0%] opacity:duration-200"
                                : "opacity-100 opacity:duration-0"
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
