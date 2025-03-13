import { CoreLayoutProps, useLogout } from "react-admin";
import { useLocation } from "react-router-dom";
import { useState } from "react";
// import Logo from "@/lib/icons/Logo";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { Header } from "@/components/widgets/shared/Header";
import { Sidebar } from "./Sidebar";
import { useGetResourceHeaderData } from "@/hooks/useGetResourceHeaderData";

export const MainLayout = ({ children }: CoreLayoutProps) => {
    const location = useLocation();

    const { resourceName } = useGetResourceHeaderData();

    const logout = useLogout();
    const handleLogout = () => {
        location.pathname = "/";
        logout();
    };

    const [testKeysModalOpen, setTestKeysModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen">
            <Header handleLogout={handleLogout} />
            <div className="flex h-full overflow-hidden">
                <Sidebar resourceName={resourceName} setTestKeysModalOpen={setTestKeysModalOpen} />
                <div
                    className={`bg-neutral-20 dark:bg-muted overflow-y-auto grow scrollbar-stable transition-[margin-left] relative  ${
                        resourceName[1] === "storage" ? " overflow-y-hidden overflow-x-hidden" : ""
                    }`}>
                    <main
                        className={`p-6 pr-4 h-full flex flex-col container ${
                            resourceName[0] == "error" ? "h-full" : ""
                        }`}>
                        {children}
                    </main>
                </div>
            </div>

            <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
        </div>
    );
};
