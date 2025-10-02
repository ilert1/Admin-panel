import { BaseFieldConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, TrashButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import { Info, PlusCircle } from "lucide-react";
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
    authSchema?: BaseFieldConfig[];
}

export const AuthDataEditTable = ({ authData, onChangeAuthData, loading, authSchema }: IAuthDataEditTable) => {
    const translate = useTranslate();

    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [errors, setErrors] = useState<{ key?: string; value?: string; [key: string]: string | undefined }>({});

    const handleDelete = (key: string) => {
        onChangeAuthData(authData.filter(item => item.key !== key));
    };

    const validateNewRow = (key: string, value: string) => {
        const newErrors: { key?: string; value?: string } = {};

        if (!key.trim()) newErrors.key = translate("resources.terminals.errors.key_error");
        else if (authData.some(item => item.key === key.trim()))
            newErrors.key = translate("resources.terminals.errors.duplicate_key_error");

        if (!value.trim()) newErrors.value = translate("resources.terminals.errors.value_error");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addAuthData = (key?: string, value?: string) => {
        const k = key ?? newKey.trim();
        const v = value ?? newValue.trim();

        if (!validateNewRow(k, v)) return;

        onChangeAuthData([...authData, { id: authData.length, key: k, value: v }]);
        setNewKey("");
        setNewValue("");
        setErrors({});
    };

    const onNewKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewKey(val);

        if (errors.key) {
            if (val.trim() && !authData.some(item => item.key === val.trim())) {
                setErrors(prev => ({ ...prev, key: undefined }));
            }
        }
    };

    const onNewValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewValue(val);

        if (errors.value && val.trim()) {
            setErrors(prev => ({ ...prev, value: undefined }));
        }
    };

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>, authDataKey: string) => {
        const value = e.target.value;
        onChangeAuthData(authData.map(item => (item.key === authDataKey ? { ...item, value } : item)));
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, oldKey: string) => {
        const newKey = e.target.value;
        const isDuplicate = authData.some(item => item.key === newKey && item.key !== oldKey);

        if (!isDuplicate) {
            onChangeAuthData(authData.map(item => (item.key === oldKey ? { ...item, key: newKey } : item)));
        }
    };

    return (
        <div className="flex w-full flex-col">
            <div className="grid w-full grid-cols-[1fr,1fr,100px] bg-green-50">
                <p className="border-r border-neutral-40 bg-green-50 px-4 py-[11px] text-base text-neutral-0 dark:border-muted">
                    {translate("resources.terminals.fields.key")}
                </p>

                <p className="bg-green-50 px-4 py-[11px] text-base text-neutral-0">
                    {translate("resources.terminals.fields.value")}
                </p>
            </div>

            {authData.map((item, index) => {
                const currentAuthSchema = authSchema?.find(schema => schema.key === item.key);

                const validRegExp = currentAuthSchema?.validation_pattern
                    ? new RegExp(currentAuthSchema.validation_pattern).test(item.value)
                    : true;

                const duplicateError = authData.filter(i => i.key === item.key).length > 1;

                return (
                    <div
                        key={item.id}
                        className={clsx(
                            "grid w-full grid-cols-[1fr,1fr,100px] bg-green-50",
                            index % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                        )}>
                        <div className="flex gap-2 border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            {currentAuthSchema?.required ? (
                                <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                                    <Tooltip disableHoverableContent>
                                        <TooltipTrigger asChild className="!mt-0" role="none">
                                            <div className="relative w-full">
                                                <Input
                                                    disabled
                                                    className="disabled:bg-neutral-0 disabled:dark:bg-neutral-100"
                                                    value={item.key}
                                                    type="text"
                                                />

                                                <span className="pointer-events-none absolute right-1.5 top-0 text-lg text-red-40">
                                                    *
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="pointer-events-none text-center">
                                                {translate("resources.terminals.errors.requiredFieldTooltip")}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <Input
                                    value={item.key}
                                    onChange={e => onKeyChange(e, item.key)}
                                    error={!item.key || duplicateError}
                                    errorMessage={
                                        !item.key
                                            ? translate("resources.terminals.errors.key_error")
                                            : duplicateError
                                              ? translate("resources.terminals.errors.duplicate_key_error")
                                              : undefined
                                    }
                                    type="text"
                                />
                            )}

                            {currentAuthSchema?.description && currentAuthSchema.description.length > 0 && (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger role="tooltip" asChild>
                                            <Button variant="secondary" className="p-0">
                                                <Info className="text-neutral-60 dark:text-neutral-40" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                                            <p>{currentAuthSchema.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <div className="flex border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            <Input
                                copyValue
                                value={item.value}
                                onChange={e => onValueChange(e, item.key)}
                                error={!item.value || !validRegExp}
                                errorMessage={
                                    !item.value
                                        ? translate("resources.terminals.errors.value_error")
                                        : !validRegExp
                                          ? translate("resources.terminals.errors.regExpValidation", {
                                                regExp: currentAuthSchema?.validation_pattern
                                            })
                                          : undefined
                                }
                                type="password_masked"
                            />
                        </div>

                        <div className="flex justify-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            <TrashButton
                                disabled={loading || currentAuthSchema?.required}
                                onClick={() => handleDelete(item.key)}
                            />
                        </div>
                    </div>
                );
            })}

            {authSchema?.map(schema => {
                if (!authData.find(item => item.key === schema.key)?.key && schema.required) {
                    return (
                        <div
                            key={schema.key}
                            className={clsx(
                                "grid w-full grid-cols-[1fr,1fr,100px] items-start bg-green-50",
                                authData.length % 2
                                    ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                    : "bg-neutral-0 dark:bg-neutral-100"
                            )}>
                            <div className="flex gap-2 border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                                <div className="relative w-full">
                                    <Input disabled value={schema.key} type="text" />

                                    <span className="pointer-events-none absolute right-1.5 top-0 text-lg text-red-40">
                                        *
                                    </span>
                                </div>

                                {schema?.description && schema?.description.length > 0 && (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={100}>
                                            <TooltipTrigger role="tooltip" asChild className="h-auto">
                                                <Button variant="secondary" className="p-0">
                                                    <Info className="text-neutral-60 dark:text-neutral-40" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                                                <p>{schema?.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>

                            <div className="flex border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                                <Input disabled={true} value={schema.default_value || ""} />
                            </div>

                            <div className="flex justify-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                                <Button disabled={loading} className="h-9 px-2" variant="default">
                                    <PlusCircle onClick={() => addAuthData(schema.key, schema.default_value || "")} />
                                </Button>
                            </div>
                        </div>
                    );
                }
            })}

            <div
                className={clsx(
                    "grid w-full grid-cols-[1fr,1fr,100px] items-start bg-green-50",
                    authData.length % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                )}>
                <div className="flex border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={!!errors.key}
                        errorMessage={errors.key}
                        disabled={loading}
                        value={newKey}
                        onChange={onNewKeyChange}
                    />
                </div>

                <div className="flex border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Input
                        error={!!errors.value}
                        errorMessage={errors.value}
                        disabled={loading}
                        value={newValue}
                        onChange={onNewValueChange}
                    />
                </div>

                <div className="flex justify-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                    <Button disabled={loading} className="h-9 px-2" variant="default">
                        <PlusCircle onClick={() => addAuthData()} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
