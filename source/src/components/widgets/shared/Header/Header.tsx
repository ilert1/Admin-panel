import { useGetIdentity } from "react-admin";
import { LangSwitcher } from "../../components/LangSwitcher";
import { ProfileDropdown } from "./ProfileDropdown";

export const Header = ({ handleLogout }: { handleLogout: () => void }) => {
    const identity = useGetIdentity();

    return (
        <header className="z-100 pointer-events-auto relative flex h-[84px] flex-shrink-0 items-center gap-4 bg-header px-4">
            {identity?.data && (
                <div className="ml-auto mr-6 flex items-center gap-2">
                    <div className="!z-60 relative flex items-center gap-8">
                        <ProfileDropdown handleLogout={handleLogout} />

                        <LangSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
};
