import { createContext, useContext, useState, ReactNode } from "react";

type SheetKey =
    | "account"
    | "direction"
    | "merchant"
    | "user"
    | "transaction"
    | "terminal"
    | "wallet"
    | "walletLinked"
    | "walletTransactions";

interface SheetData {
    id?: string;
    provider?: string;
    merchantName?: string;
}

interface SheetState {
    key: SheetKey;
    open: boolean;
    data?: SheetData;
}

interface SheetContextProps {
    sheets: SheetState[];
    openSheet: (key: SheetKey, data?: SheetData) => void;
    closeSheet: (key: SheetKey) => void;
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
    const [sheets, setSheets] = useState<SheetState[]>([]);

    const openSheet = (key: SheetKey, data?: SheetData) => {
        setSheets(prev => [
            ...prev.filter(sheet => sheet.key !== key), // Убираем старую запись, если уже есть
            { key, open: true, data }
        ]);
    };

    const closeSheet = (key: SheetKey) => {
        setSheets(prev => prev.map(sheet => (sheet.key === key ? { ...sheet, open: false } : sheet)));
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
