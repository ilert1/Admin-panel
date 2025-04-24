import { TerminalAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, TrashButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { TextField } from "@/components/ui/text-field";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslate } from "react-admin";

interface IAuthDataEditTable {
    loading: boolean;
    authData: TerminalAuth | undefined;
    onChangeAuthData: (val: TerminalAuth) => void;
    originalAuthData: TerminalAuth | undefined;
}

export const AuthDataEditTable = ({ authData, onChangeAuthData, originalAuthData, loading }: IAuthDataEditTable) => {
    const translate = useTranslate();

    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [errors, setErrors] = useState({ keyError: false, valueError: false });

    const parseAuthData = useMemo(
        () => (authData ? Object.keys(authData).map(key => ({ key, value: authData[key] as string })) : []),
        [authData]
    );

    const handleDelete = (key: string) => {
        const tempAuthData = { ...authData };
        delete tempAuthData[key];
        onChangeAuthData(tempAuthData);
    };

    const addAuthData = () => {
        if (!newKey || !newValue) {
            setErrors({ keyError: !newKey, valueError: !newValue });
            return;
        }
        onChangeAuthData({ ...authData, [newKey]: newValue });
        setNewKey("");
        setNewValue("");
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;

        if (!!key && errors.keyError) {
            setErrors({ ...errors, keyError: false });
        } else if (!key && !errors.keyError) {
            setErrors({ ...errors, keyError: true });
        }

        setNewKey(key);
    };

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!!value && errors.valueError) {
            setErrors({ ...errors, valueError: false });
        } else if (!value && !errors.valueError) {
            setErrors({ ...errors, valueError: true });
        }

        setNewValue(value);
    };

    return (
        <div className="flex w-full flex-col">
            <div className="grid w-full grid-cols-[1fr,1fr,100px] bg-green-50">
                <p className="border-r border-neutral-40 bg-green-50 px-4 py-[11px] text-base text-neutral-0 dark:border-muted">
                    Key
                </p>

                <p className="bg-green-50 px-4 py-[11px] text-base text-neutral-0">Value</p>
            </div>

            {parseAuthData.map((item, index) => (
                <div
                    key={item.key}
                    className={clsx(
                        "grid w-full grid-cols-[1fr,1fr,100px] bg-green-50",
                        index % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                    )}>
                    <div className="flex items-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                        <TextField text={item.key} wrap lineClamp />
                    </div>

                    <div className="flex items-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                        <TextField
                            text={item.value}
                            type={!originalAuthData?.[item.key] ? "text" : "secret"}
                            wrap
                            copyValue
                            lineClamp
                            linesCount={1}
                            minWidth="50px"
                        />
                    </div>

                    <div className="flex items-center justify-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                        <TrashButton disabled={loading} onClick={() => handleDelete(item.key)} />
                    </div>
                </div>
            ))}

            <div
                className={clsx(
                    "grid w-full grid-cols-[1fr,1fr,100px] items-start bg-green-50",
                    parseAuthData.length % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                )}>
                <div className="flex items-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={errors.keyError}
                        errorMessage={translate("resources.terminals.errors.key_error")}
                        disabled={loading}
                        value={newKey}
                        onChange={onKeyChange}
                    />
                </div>

                <div className="flex items-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={errors.valueError}
                        errorMessage={translate("resources.terminals.errors.value_error")}
                        disabled={loading}
                        value={newValue}
                        onChange={onValueChange}
                    />
                </div>

                <div className="flex items-center justify-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Button disabled={loading} className="h-9 px-2" variant="default">
                        <PlusCircle onClick={addAuthData} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
