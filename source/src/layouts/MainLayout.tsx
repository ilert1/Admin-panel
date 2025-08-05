import { CoreLayoutProps, useLogout } from "react-admin";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { Header } from "@/components/widgets/shared/Header/Header";
import { Sidebar } from "./Sidebar";
import { useGetResourceHeaderData } from "@/hooks/useGetResourceHeaderData";
import { TestEnvPopup } from "./TestEnvPopup";
import { TestEnvText } from "@/components/widgets/components/ResourceHeaderTitle";

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
        <>
            <div className="flex h-full flex-col md:h-screen">
                <Header handleLogout={handleLogout} />
                <div className="flex h-full overflow-hidden">
                    <Sidebar resourceName={resourceName} setTestKeysModalOpen={setTestKeysModalOpen} />
                    <div
                        className={`relative grow overflow-y-auto bg-neutral-20 transition-[margin-left] scrollbar-stable dark:bg-muted ${
                            resourceName[1] === "storage" ? "overflow-x-hidden overflow-y-hidden" : ""
                        }`}>
                        <main
                            className={`container flex h-full flex-col p-6 pr-4 ${
                                resourceName[0] == "error" ? "h-full" : ""
                            }`}>
                            <>
                                <TestEnvText />
                                {children}
                            </>
                        </main>
                    </div>
                </div>
                <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
            </div>
            <TestEnvPopup />
        </>
    );
};
