import React, { useEffect, useState } from "react";
import { useLogin, useTranslate } from "react-admin";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers";
import { Input } from "@/components/ui/input";
import { LangSwitcher } from "@/components/widgets/components/LangSwitcher";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alertdialog";

const realm = import.meta.env.VITE_KEYCLOAK_REALM;
const kk = import.meta.env.VITE_KEYCLOAK_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formEnabled, setFormEnabled] = useState(true);
    const { theme } = useTheme();

    const translate = useTranslate();
    const login = useLogin();
    const navigate = useNavigate();

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

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (error) setError("");
        };

    return (
        <>
            <div className="flex flex-shrink-0 justify-end h-[84px] items-center gap-4 bg-header px-4 relative z-100 pointer-events-auto z">
                <LangSwitcher />
            </div>

            <div
                className="relative flex items-center justify-center bg-loginBG overflow-hidden min-h-[508px] h-[calc(100vh-84px)]"
                style={{
                    backgroundImage: "url(/LoginBackground.svg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}>
                <div
                    className={`mx-4 my-4 overflow-y-auto w-full max-w-md px-8 sm:px-16 pb-16 rounded-16 shadow-md min-w-[240px] z-10 ${
                        theme === "dark" ? "bg-neutral-0" : "bg-neutral-100"
                    }`}>
                    <div className="flex justify-center mb-2.5 mt-5">
                        <img
                            src="/MoneyGateLogo.svg"
                            alt="Logo"
                            className="h-20 w-56 pointer-events-none select-none"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="username" className="block text-note-1 text-neutral-30 mb-1">
                                {translate("app.login.usernameOrEmail")}
                            </label>

                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={handleChange(setUsername)}
                                className=" block w-full border-gray-300 rounded-md shadow-sm text-title-1"
                            />
                        </div>

                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block text-note-1 text-neutral-30 mb-1">
                                {translate("app.login.password")}
                            </label>

                            <div className="flex items-center relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handleChange(setPassword)}
                                    className=" block w-full border-gray-300 rounded-md shadow-sm pr-10 text-title-1"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="username" className="block text-note-1 text-neutral-30 mb-1">
                                {translate("app.login.totp")}
                            </label>

                            <Input
                                id="totp"
                                type="text"
                                value={totpCode}
                                onChange={handleChange(setTotpCode)}
                                className=" block w-full border-gray-300 rounded-md shadow-sm text-title-1"
                            />

                            <div className="flex justify-center mt-4">
                                <a className="text-xs text-green-50 dark:text-green-40" href={configure2faLink}>
                                    {translate("app.login.configure2fa")}
                                </a>
                            </div>
                        </div>

                        <Button type="submit" color="primary" variant="default" className="w-full">
                            {translate("app.login.login")}
                        </Button>

                        {error && <div className="text-red-30 text-note-1 mt-5">{error}</div>}
                    </form>
                </div>

                <div className="absolute bottom-[-20px] right-[-20px] p-4">
                    <img
                        src="/BlowFish.svg"
                        alt="Decorative"
                        className="w-[200px] h-[200px] lg:w-[320px] lg:h-[320px] xl:w-[400px] xl:h-[400px]pointer-events-none select-none -z-50"
                    />
                </div>

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent className="w-[350px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">
                                {translate("app.login.accountConfigTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <div className="flex flex-col sm:flex-row justify-around gap-4 sm:gap-[35px] w-full">
                                <a href={kk} target="_blank" rel="noopener noreferrer">
                                    <AlertDialogAction className="w-full sm:w-40">
                                        {translate("app.login.accountConfigConfirm")}
                                    </AlertDialogAction>
                                </a>
                                <AlertDialogCancel className="w-full !ml-0 px-3 sm:w-24">
                                    {translate("app.ui.actions.cancel")}
                                </AlertDialogCancel>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};
