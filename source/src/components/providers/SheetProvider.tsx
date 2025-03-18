import { ReactNode, useState, useContext, createContext } from "react";
import { SHEETS_COMPONENTS } from "./SheetManager";

type SheetKey = keyof typeof SHEETS_COMPONENTS;

interface SheetDataMap {
    account: { id: string };
    direction: { id: string };
    merchant: { id: string; merchantName: string };
    user: { id: string };
    transaction: { id: string };
    terminal: { id: string; provider: string };
    wallet: { id: string };
    walletLinked: { id: string };
    walletTransactions: { id: string };
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
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
    const [sheets, setSheets] = useState<SheetState<SheetKey>[]>([]);

    const openSheet = <K extends SheetKey>(key: K, data: SheetDataMap[K]) => {
        setSheets(prev => [...prev.filter(s => s.key !== key), { key, open: true, data }]);
    };

    const closeSheet = (key: SheetKey) => {
        setSheets(prev => prev.map(s => (s.key === key ? { ...s, open: false } : s)));
    };

    return <SheetContext.Provider value={{ sheets, openSheet, closeSheet }}>{children}</SheetContext.Provider>;
};

export const useSheets = () => {
    const context = useContext(SheetContext);
    if (!context) {
        throw new Error("useSheets must be used within a SheetProvider");
    }
    return context;
};
