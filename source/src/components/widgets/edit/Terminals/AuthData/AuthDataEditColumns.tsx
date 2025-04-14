import { TerminalAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, TrashButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { TextField } from "@/components/ui/text-field";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const useAuthDataEditColumns = ({
    authData,
    setAuthData
}: {
    authData: TerminalAuth | undefined;
    setAuthData: (data: TerminalAuth) => void;
}) => {
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    const handleDelete = (key: string) => {
        const tempAuthData = { ...authData };
        delete tempAuthData[key];
        setAuthData(tempAuthData);
    };

    const columns: ColumnDef<{
        id: number;
        key: string;
        value: string;
    }>[] = [
        {
            id: "key",
            accessorKey: "key",
            header: "Key",
            cell: ({ row }) => {
                const isLast = row.original.id === Object.keys(authData || {}).length;
                return isLast ? (
                    <Input value={newKey} onChange={e => setNewKey(e.target.value)} />
                ) : (
                    <TextField text={row.original.key} wrap lineClamp />
                );
            }
        },
        {
            id: "value",
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => {
                const isLast = row.original.id === Object.keys(authData || {}).length;
                return isLast ? (
                    <Input value={newValue} onChange={e => setNewValue(e.target.value)} />
                ) : (
                    <TextField text={row.original.value} type="secret" copyValue />
                );
            }
        },
        {
            id: "delete_field",
            cell: ({ row }) => {
                const isLast = row.original.id === Object.keys(authData || {}).length;
                return isLast ? (
                    <div className="flex items-center justify-center">
                        <Button className="px-2" variant="default">
                            <PlusCircle
                                onClick={() => {
                                    if (!newKey) return;
                                    setAuthData({ ...authData, [newKey]: newValue });
                                    setNewKey("");
                                    setNewValue("");
                                }}
                            />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <TrashButton onClick={() => handleDelete(row.original.key)} />
                    </div>
                );
            }
        }
    ];

    return { authDataColumns: columns };
};
