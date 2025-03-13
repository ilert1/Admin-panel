import { CoreLayoutProps, useLogout, usePermissions, useResourceDefinitions } from "react-admin";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
// import Logo from "@/lib/icons/Logo";
import { useGetResLabel } from "@/hooks/useGetResLabel";
import { KeysModal } from "@/components/widgets/components/KeysModal";
import { Header } from "@/components/widgets/shared/Header";
import { Sidebar } from "./Sidebar";

enum SplitLocations {
    show = "show",
    edit = "edit",
    new = "new"
}

export const MainLayout = ({ children }: CoreLayoutProps) => {
    const resources = useResourceDefinitions();
    const getResLabel = useGetResLabel();
    const { permissions } = usePermissions();
    const location = useLocation();

    const resourceName = useMemo(() => {
        const urlParts = location.pathname?.split("/")?.filter((s: string) => s?.length > 0);

        Object.values(SplitLocations).forEach(item => {
            if (urlParts.includes(item)) {
                const tempResource = urlParts.splice(urlParts.indexOf(item) - 1, 2);
                urlParts.push(tempResource.join("/"));
            }
        });

        const isWrongResource =
            Object.keys(resources).length !==
            new Set([...Object.keys(resources), urlParts[0] !== "" && urlParts[0]]).size;

        return isWrongResource ? ["error"] : urlParts;
    }, [location, resources]);

    const pageTitle = useMemo(() => {
        if (resourceName.length > 0) {
            if (resourceName[0] === "wallet") {
                if (resourceName[1]) {
                    return getResLabel(`wallet.${resourceName[1]}`, permissions);
                } else {
                    return getResLabel(`wallet.manage`, permissions);
                }
            }

            return getResLabel(resourceName[0], permissions);
        }
    }, [getResLabel, permissions, resourceName]);

    const logout = useLogout();
    const handleLogout = () => {
        location.pathname = "/";
        logout();
    };

    const [testKeysModalOpen, setTestKeysModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full md:h-screen">
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
                        {resourceName[0] !== "bank-transfer" && resourceName[0] !== "error" && (
                            <h1 className="text-3xl mb-6 text-neutral-90 dark:text-white">{pageTitle}</h1>
                        )}
                        {children}
                    </main>
                </div>
            </div>

            <KeysModal open={testKeysModalOpen} onOpenChange={setTestKeysModalOpen} isTest />
        </div>
    );
};
