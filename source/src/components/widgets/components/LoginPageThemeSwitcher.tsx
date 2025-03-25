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
            className="relative z-[-2] flex h-[60px] w-[140px] cursor-pointer items-center overflow-hidden rounded-full border border-neutral-50 bg-white dark:bg-black"
            onClick={toggleTheme}>
            <div className="absolute flex h-full w-full items-center gap-0">
                <div className="flex items-center">
                    <div
                        className={cn(
                            "opacity:duration-0 z-1 absolute m-[5px] mr-0 overflow-hidden rounded-full bg-neutral-50 duration-500 ease-in-out",
                            theme === "dark" ? "ml-[7px] translate-x-0 opacity-100" : "translate-x-[160%] opacity-0"
                        )}
                        style={{
                            boxShadow: "0px 0px 16px rgba(255, 2555, 255, 0.75)"
                        }}>
                        <MoonIcon className="z-2 shadow-1" />
                    </div>
                    <div
                        className={cn(
                            "opacity:duration-0 z-1 ml-0 cursor-pointer overflow-hidden rounded-full duration-500 ease-in-out",
                            theme === "dark" ? "translate-x-[15%] opacity-0" : "translate-x-[165%] opacity-100"
                        )}>
                        <SunIcon
                            style={{
                                boxShadow: "0px 0px 12px rgba(241, 197, 42, 0.75)",
                                borderRadius: "50%",
                                border: "0"
                            }}
                            className="z-2 shadow-1"
                        />
                    </div>
                </div>
                <div
                    className={cn(
                        "z-[-1] ml-1 flex h-full w-full items-center justify-end",
                        theme === "dark" ? "translate-x-0" : "-translate-x-[60%]"
                    )}>
                    <Text
                        text={translate("app.login.darkTheme")}
                        className={cn(
                            "absolute z-[-1] w-full select-none px-[13px] py-[16px] text-center !text-title-2 text-neutral-90 ease-in-out dark:text-neutral-0",
                            theme === "dark"
                                ? "opacity:duration-0 opacity-100"
                                : "opacity:duration-200 translate-x-[0%] opacity-0"
                        )}
                    />
                    <Text
                        text={translate("app.login.lightTheme")}
                        className={cn(
                            "absolute z-[-1] w-full select-none px-[13px] py-[16px] text-center !text-title-2 text-neutral-90 ease-in-out dark:text-neutral-0",
                            theme === "dark"
                                ? "opacity:duration-200 -translate-x-[0%] opacity-0"
                                : "opacity:duration-0 opacity-100"
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
