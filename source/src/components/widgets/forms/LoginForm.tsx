import { useTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input/input";
import { useState } from "react";
import { useLogin, useTranslate } from "react-admin";

const realm = import.meta.env.VITE_KEYCLOAK_REALM;
const kk = import.meta.env.VITE_KEYCLOAK_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

interface LoginFormProps {
    error: string;
    setError: (error: string) => void;
    setDialogOpen: (state: boolean) => void;
}

export const LoginForm = (props: LoginFormProps) => {
    const { error, setError, setDialogOpen } = props;

    const translate = useTranslate();
    const login = useLogin();
    const { theme } = useTheme();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");

    const [formEnabled, setFormEnabled] = useState(true);

    const configure2faLink = `${kk}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${window.location.href}&response_type=code&scope=openid&kc_action=CONFIGURE_TOTP`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formEnabled) {
            setFormEnabled(false);

            const userData = {
                username,
                password,
                totpCode
            };

            login(userData).catch(error => {
                if (error.status === 401) {
                    setError(translate("app.login.logPassError"));
                } else if (
                    error.status === 400 &&
                    error.body.error === "invalid_grant" &&
                    error.body.error_description.includes("not fully")
                ) {
                    setError(translate("app.login.accountError"));
                    setDialogOpen(true);
                } else {
                    setError(translate("app.login.networkError"));
                }

                setFormEnabled(true);
            });
        }
    };

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (error) setError("");
        };
    return (
        <div
            className={`mx-4 my-4 overflow-y-auto w-full max-w-md px-8 sm:px-16 pb-12 rounded-16 shadow-md min-w-[240px] z-10 bg-white dark:bg-neutral-100`}>
            <div className="flex justify-center mb-2.5 mt-5">
                <img
                    src={theme === "light" ? "/NoNameLogoLight.svg" : "/NoNameLogo.svg"}
                    alt="Logo"
                    className="h-[78px] w-[126.93px] pointer-events-none select-none"
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <Input
                        type="text"
                        value={username}
                        onChange={handleChange(setUsername)}
                        className="block w-full border-gray-300 shadow-1 text-title-1"
                        label={translate("app.login.usernameOrEmail")}
                    />

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleChange(setPassword)}
                        className="block w-full border-gray-300 shadow-1 text-title-1"
                        label={translate("app.login.password")}
                    />

                    <Input
                        id="totp"
                        type="text"
                        value={totpCode}
                        onChange={handleChange(setTotpCode)}
                        className="block w-full border-neutral-40 shadow-1 text-title-1"
                        label={translate("app.login.totp")}
                    />
                </div>

                <div className="flex justify-center mt-4 mb-7">
                    <a className="text-xs text-green-50 dark:text-green-40" href={configure2faLink}>
                        {translate("app.login.configure2fa")}
                    </a>
                </div>

                <Button type="submit" color="primary" variant="default" className="w-full">
                    {translate("app.login.login")}
                </Button>
                {error && <div className="text-red-30 text-note-1 mt-5">{error}</div>}
            </form>
        </div>
    );
};
