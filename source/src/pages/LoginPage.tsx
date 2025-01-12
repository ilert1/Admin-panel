import { useEffect, useState } from "react";
import { useLogin, useTranslate } from "react-admin";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/providers";
import { LangSwitcher } from "@/components/widgets/components/LangSwitcher";
import { LoginBackground } from "@/lib/icons/LoginBackground";
import { LoginForm } from "@/components/widgets/forms/LoginForm";
import { AccountConfigDialog } from "@/components/widgets/components/AccountConfigDialog";

export const LoginPage = () => {
    const translate = useTranslate();
    const login = useLogin();
    const navigate = useNavigate();
    const { theme } = useTheme();

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
            <div className="flex flex-shrink-0 justify-end h-[84px] items-center gap-4 bg-header px-4 relative z-100 pointer-events-auto z">
                <LangSwitcher />
            </div>

            <div className="relative flex items-center justify-center bg-loginBG overflow-hidden min-h-[508px] h-[calc(100vh-84px)]">
                {loginBg}
                <LoginForm error={error} setError={setError} setDialogOpen={setConfigDialogOpen} />

                <div className="absolute bottom-[-20px] right-[-20px] p-4">
                    <img
                        src="/BlowFish.svg"
                        alt="Decorative"
                        className="w-[200px] h-[200px] lg:w-[320px] lg:h-[320px] xl:w-[400px] xl:h-[400px] pointer-events-none select-none -z-50"
                    />
                </div>
                <AccountConfigDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} />
            </div>
        </>
    );
};
