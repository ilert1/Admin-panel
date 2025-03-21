import { useEffect, useState } from "react";
import { useLogin, useTranslate } from "react-admin";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/providers";
import { LangSwitcher } from "@/components/widgets/components/LangSwitcher";
import { LoginBackground } from "@/lib/icons/LoginBackground";
import { LoginForm } from "@/components/widgets/forms/LoginForm";
import { AccountConfigDialog } from "@/components/widgets/components/AccountConfigDialog";
import { LoginPageThemeSwitcher } from "@/components/widgets/components/LoginPageThemeSwitcher";

export const LoginPage = () => {
    const translate = useTranslate();
    const login = useLogin();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [formEnabled, setFormEnabled] = useState(true);

    const getTokenByCode = (totpRequestCode: string) => {
        if (formEnabled) {
            setFormEnabled(false);

            login({ totpRequestCode }).catch(error => {
                if (error.status === 401) {
                    setError(translate("app.login.logPassError"));
                } else {
                    setError(translate("app.login.networkError"));
                }

                setFormEnabled(true);
                navigate("/", { replace: true });
            });
        }
    };

    const [params] = useSearchParams();
    const totpRequestCode = params.get("code");

    useEffect(() => {
        if (totpRequestCode) {
            setFormEnabled(false);
            getTokenByCode(totpRequestCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loginBg = LoginBackground(theme === "dark" ? "#237648" : "#62D093");
    return (
        <>
            <header className="z-100 z pointer-events-auto relative flex h-[84px] flex-shrink-0 items-center justify-end gap-8 bg-header px-4">
                <LoginPageThemeSwitcher theme={theme} setTheme={setTheme} translate={translate} />
                <LangSwitcher />
            </header>

            <main className="relative flex h-[calc(100%-84px)] min-h-[508px] items-center justify-center overflow-hidden bg-loginBG md:h-[calc(100vh-84px)]">
                {loginBg}
                <LoginForm error={error} setError={setError} setDialogOpen={setConfigDialogOpen} />

                <div className="absolute bottom-[-20px] right-[-20px] p-4">
                    <img
                        src="/BlowFish.svg"
                        alt="Decorative"
                        className="pointer-events-none -z-50 h-[200px] w-[200px] select-none lg:h-[320px] lg:w-[320px] xl:h-[400px] xl:w-[400px]"
                    />
                </div>
                <AccountConfigDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} />
            </main>
        </>
    );
};
