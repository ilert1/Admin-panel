import React, { useState } from "react";
import { useLogin, useTranslate } from "react-admin";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { theme } = useTheme();
    const translate = useTranslate();
    const login = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ username, password }).catch(() => {
            setError(translate("app.login.error"));
        });
    };

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (error) setError("");
        };

    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-loginBG overflow-hidden"
            style={{
                backgroundImage: "url(/LoginBackground.png)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }}>
            <div
                className={`mx-4 w-full max-w-md px-8 sm:px-16 pb-16 rounded-16 shadow-md min-w-[240px] z-10 ${
                    theme === "dark" ? "bg-neutral-0" : "bg-neutral-100"
                }`}>
                <div className="flex justify-center mb-2.5 mt-5">
                    <img src="/MoneyGateLogo.svg" alt="Logo" className="h-20 w-56 pointer-events-none select-none" />
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
        </div>
    );
};
