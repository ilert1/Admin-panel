import { Button, TrashButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import clsx from "clsx";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

type ParseAuthData = {
    id: number;
    key: string;
    value: string;
}[];
interface IAuthDataEditTable {
    loading: boolean;
    authData: ParseAuthData;
    onChangeAuthData: (val: ParseAuthData) => void;
}

export const AuthDataEditTable = ({ authData, onChangeAuthData, loading }: IAuthDataEditTable) => {
    const translate = useTranslate();

    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [errors, setErrors] = useState({ keyError: false, valueError: false });

    const handleDelete = (key: string) => {
        onChangeAuthData(authData.filter(item => item.key !== key));
    };

    const addAuthData = () => {
        if (!newKey || !newValue || !!authData.find(item => item.key === newKey)) {
            setErrors({ keyError: !newKey || !!authData.find(item => item.key === newKey), valueError: !newValue });
            return;
        }
        onChangeAuthData([...authData, { id: authData.length, key: newKey, value: newValue }]);
        setNewKey("");
        setNewValue("");
    };

    const onNewKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;

        if (!!key && errors.keyError) {
            setErrors({ ...errors, keyError: false });
        } else if (!key && !errors.keyError) {
            setErrors({ ...errors, keyError: true });
        }

        setNewKey(key);
    };

    const onNewValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!!value && errors.valueError) {
            setErrors({ ...errors, valueError: false });
        } else if (!value && !errors.valueError) {
            setErrors({ ...errors, valueError: true });
        }

        setNewValue(value);
    };

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, authDataKey: string) => {
        const value = e.target.value;
        onChangeAuthData(
            authData.map(item => (item.key === authDataKey ? { id: item.id, key: item.key, value } : item))
        );
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, authDataKey: string) => {
        const value = e.target.value;
        onChangeAuthData(
            authData.map(item => (item.key === authDataKey ? { id: item.id, key: value, value: item.value } : item))
        );
    };

    return (
        <div className="flex w-full flex-col">
            <div className="grid w-full grid-cols-[1fr,1fr,100px] bg-green-50">
                <p className="border-r border-neutral-40 bg-green-50 px-4 py-[11px] text-base text-neutral-0 dark:border-muted">
                    Key
                </p>

                <p className="bg-green-50 px-4 py-[11px] text-base text-neutral-0">Value</p>
            </div>

            {authData.map((item, index) => (
                <div
                    key={item.id}
                    className={clsx(
                        "grid w-full grid-cols-[1fr,1fr,100px] bg-green-50",
                        index % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                    )}>
                    <div className="flex items-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                        <Input
                            value={item.key}
                            onChange={e => onKeyChange(e, item.key)}
                            error={item.key.length === 0}
                            errorMessage={translate("resources.terminals.errors.value_error")}
                            type="text"
                        />
                    </div>

                    <div className="flex items-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                        <Input
                            value={item.value}
                            onChange={e => onValueChange(e, item.key)}
                            error={item.value.length === 0}
                            errorMessage={translate("resources.terminals.errors.value_error")}
                            type="password_masked"
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
                    authData.length % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                )}>
                <div className="flex items-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={errors.keyError}
                        errorMessage={translate("resources.terminals.errors.key_error")}
                        disabled={loading}
                        value={newKey}
                        onChange={onNewKeyChange}
                    />
                </div>

                <div className="flex items-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={errors.valueError}
                        errorMessage={translate("resources.terminals.errors.value_error")}
                        disabled={loading}
                        value={newValue}
                        onChange={onNewValueChange}
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
