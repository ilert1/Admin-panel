import { ReactNode, useState, useContext, createContext } from "react";
import { SHEETS_COMPONENTS } from "./SheetManager";
import { useCheckAuth } from "react-admin";

type SheetKey = keyof typeof SHEETS_COMPONENTS;

interface SheetDataMap {
    account: { id: string | undefined };
    direction: { id: string | undefined };
    merchant: { id: string | undefined; merchantName: string | undefined };
    user: { id: string | undefined };
    transaction: { id: string | undefined };
    terminal: { id: string | undefined; provider: string | undefined };
    wallet: { id: string | undefined };
    walletLinked: { id: string | undefined };
    walletTransactions: { id: string | undefined };
    callbridgeMappings: { id: string | undefined };
    callbridgeHistory: { id: string | undefined };
    systemPaymentInstrument: { id: string | undefined };
}

type SheetState<K extends SheetKey> = {
    key: K;
    open: boolean;
    data: SheetDataMap[K];
};

interface SheetContextProps {
    sheets: SheetState<SheetKey>[];
    openSheet: <K extends SheetKey>(key: K, data: SheetDataMap[K]) => void;
    closeSheet: (key: SheetKey) => void;
    closeAllSheets: () => void;
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);
export const SheetProvider = ({ children }: { children: ReactNode }) => {
    const [sheets, setSheets] = useState<SheetState<SheetKey>[]>([]);
    const checkAuth = useCheckAuth();

    const closeAllSheets = () => {
        setSheets([]);
    };

    const openSheet = async <K extends SheetKey>(key: K, data: SheetDataMap[K]) => {
        checkAuth()
            .then(() => {
                setSheets(prev => [...prev, { key, open: true, data }]);
            })
            .catch(() => {});
    };

    const closeSheet = (key: SheetKey) => {
        setSheets(prev => {
            const index = prev.findLastIndex(s => s.key === key);
            if (index === -1) return prev;

            const updatedSheets = [...prev];
            updatedSheets[index] = { ...updatedSheets[index], open: false };

            setTimeout(() => {
                setSheets(sheets => sheets.filter((_, i) => i !== index));
            }, 300);

            return updatedSheets;
        });
    };

    return (
        <SheetContext.Provider value={{ sheets, openSheet, closeSheet, closeAllSheets }}>
            {children}
        </SheetContext.Provider>
    );
};
export const useSheets = () => {
    const context = useContext(SheetContext);
    if (!context) {
        throw new Error("useSheets must be used within a SheetProvider");
    }
    return context;
};
