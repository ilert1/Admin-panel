import React, { useState } from "react";
import { useLogin, useTranslate } from "react-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/providers";
import { Eye, EyeOff } from "lucide-react";

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
            style={{ backgroundImage: "url(/LoginBackground.png)" }}>
            <div
                className={`w-full max-w-md p-8 rounded-lg shadow-md ${
                    theme === "dark" ? "bg-neutral-0" : "bg-neutral-100"
                }`}>
                <div className="flex justify-center mb-6">
                    <img src="/MoneyGateLogo.svg" alt="Logo" className="h-12" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-title-1 text-neutral-30">
                            {translate("app.login.usernameOrEmail")}
                        </label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleChange(setUsername)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-title-1"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-title-1 text-neutral-30">
                            {translate("app.login.password")}
                        </label>
                        <div className="flex items-center relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handleChange(setPassword)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 pr-10 text-title-1"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-green-40" />
                                ) : (
                                    <Eye className="h-5 w-5 text-green-40" />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-red-30 text-note-1 mb-4">{error}</div>}
                    <Button type="submit" color="primary" variant="default" className="w-full">
                        {translate("app.login.login")}
                    </Button>
                </form>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] p-4">
                <img
                    src="/BlowFish.png"
                    alt="Decorative"
                    className="w-[400px] h-[400px] invisible md:visible md:w-[200px] md:h-[200px] lg:w-[320px] lg:h-[320px]"
                />
            </div>
        </div>
    );
};
