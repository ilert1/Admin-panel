import { ReactNode, useState, useContext, createContext } from "react";
import { SHEETS_COMPONENTS } from "./SheetManager";

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

    const closeAllSheets = () => {
        setSheets([]);
    };

    const openSheet = <K extends SheetKey>(key: K, data: SheetDataMap[K]) => {
        setSheets(prev => [...prev.filter(s => s.key !== key), { key, open: true, data }]);
    };

    const closeSheet = (key: SheetKey) => {
        setSheets(prev => prev.map(s => (s.key === key ? { ...s, open: false } : s)));
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
