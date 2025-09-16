import { useTheme } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { LoadingBlock } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { useState } from "react";
import { useAuthState, useLogin, useTranslate } from "react-admin";

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
    const { refetch: refetchLogin } = useAuthState();

    const translate = useTranslate();
    const login = useLogin();
    const { theme } = useTheme();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");

    const [formEnabled, setFormEnabled] = useState(true);

    const configure2faLink = `${kk}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${window.location.href}&response_type=code&scope=openid&kc_action=CONFIGURE_TOTP`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formEnabled) {
            setFormEnabled(false);

            const userData = {
                username,
                password,
                totpCode
            };

            await login(userData).catch(error => {
                if (error.status === 401) {
                    setError(translate("app.login.logPassError"));
                } else if (
                    error.status === 400 &&
                    error.body.error === "invalid_grant" &&
                    error.body.error_description.includes("not fully")
                ) {
                    setError(translate("app.login.accountError"));
                    setDialogOpen(true);
                } else if (error.type === "token_expired") {
                    setError(translate("app.login.tokenExpired"));
                } else {
                    setError(translate("app.login.networkError"));
                }
            });
            refetchLogin();
            setFormEnabled(true);
        }
    };

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (error) setError("");
        };
    return (
        <div
            className={`z-10 mx-4 my-4 w-full min-w-[240px] max-w-md overflow-y-auto rounded-16 bg-white px-8 pb-12 shadow-md dark:bg-neutral-100 sm:px-16`}>
            <div className="mb-2.5 mt-5 flex justify-center">
                <img
                    src={theme === "light" ? "/NoNameLogoLight.svg" : "/NoNameLogo.svg"}
                    alt="Logo"
                    className="pointer-events-none h-[78px] w-[126.93px] select-none"
                />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <Input
                        type="text"
                        value={username}
                        onChange={handleChange(setUsername)}
                        className="block w-full text-title-1"
                        label={translate("app.login.usernameOrEmail")}
                        labelSize="login-page"
                        shadow
                    />

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleChange(setPassword)}
                        className="block w-full text-title-1"
                        label={translate("app.login.password")}
                        labelSize="login-page"
                        shadow
                    />

                    <Input
                        id="totp"
                        type="text"
                        value={totpCode}
                        onChange={handleChange(setTotpCode)}
                        className="block w-full text-title-1"
                        label={translate("app.login.totp")}
                        labelSize="login-page"
                        autoComplete="off"
                        shadow
                    />
                </div>

                <div className="mb-7 mt-4 flex justify-center">
                    <TextField
                        text={translate("app.login.configure2fa")}
                        link={configure2faLink}
                        type="link"
                        className="text-sm underline-offset-4"
                    />
                </div>

                <Button type="submit" className="w-full" disabled={!formEnabled}>
                    {formEnabled ? (
                        translate("app.login.login")
                    ) : (
                        <LoadingBlock className="!h-4 !w-4 overflow-hidden" />
                    )}
                </Button>

                {error && <div className="mt-5 text-note-1 text-red-30">{error}</div>}
            </form>
        </div>
    );
};
