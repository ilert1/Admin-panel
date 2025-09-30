import { BaseFieldConfig } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { Button, TrashButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import { Info, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useTranslate } from "react-admin";

type ParseDetailsData = {
    id: number;
    key: string;
    value: string;
}[];
interface IDetailsDataEditTable {
    loading: boolean;
    detailsData: ParseDetailsData;
    onChangeDetailsData: (val: ParseDetailsData) => void;
    detailsSchema?: BaseFieldConfig[];
}

export const DetailsDataEditTable = ({
    detailsData,
    onChangeDetailsData,
    loading,
    detailsSchema
}: IDetailsDataEditTable) => {
    const translate = useTranslate();

    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [errors, setErrors] = useState({ keyError: false, valueError: false });

    const handleDelete = (key: string) => {
        onChangeDetailsData(detailsData.filter(item => item.key !== key));
    };

    const addDetailsData = (key?: string, value?: string) => {
        if (key !== undefined && value !== undefined) {
            onChangeDetailsData([...detailsData, { id: detailsData.length, key, value }]);
        } else {
            if (!newKey || !newValue || !!detailsData.find(item => item.key === newKey)) {
                setErrors({
                    keyError: !newKey || !!detailsData.find(item => item.key === newKey),
                    valueError: !newValue
                });
                return;
            }

            onChangeDetailsData([...detailsData, { id: detailsData.length, key: newKey, value: newValue }]);
            setNewKey("");
            setNewValue("");
        }
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
        onChangeDetailsData(
            detailsData.map(item => (item.key === authDataKey ? { id: item.id, key: item.key, value } : item))
        );
    };

    const onKeyChange = (e: React.ChangeEvent<HTMLInputElement>, authDataKey: string) => {
        const value = e.target.value;
        onChangeDetailsData(
            detailsData.map(item => (item.key === authDataKey ? { id: item.id, key: value, value: item.value } : item))
        );
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

            {detailsData.map((item, index) => {
                const currentDetailsSchema = detailsSchema?.find(schema => schema.key === item.key);

                const validRegExp = currentDetailsSchema?.validation_pattern
                    ? new RegExp(currentDetailsSchema.validation_pattern).test(item.value)
                    : true;

                return (
                    <div
                        key={item.id}
                        className={clsx(
                            "grid w-full grid-cols-[1fr,1fr,100px] bg-green-50",
                            index % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
                        )}>
                        <div className="flex items-center gap-2 border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            <div className="relative w-full">
                                <Input
                                    value={item.key}
                                    onChange={e => onKeyChange(e, item.key)}
                                    error={item.key.length === 0}
                                    errorMessage={translate("resources.terminals.errors.key_error")}
                                    type="text"
                                />

                                {currentDetailsSchema?.required && (
                                    <span className="pointer-events-none absolute right-1.5 top-0 text-lg text-red-40">
                                        *
                                    </span>
                                )}
                            </div>

                            {currentDetailsSchema?.description && currentDetailsSchema?.description.length > 0 && (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger role="tooltip" asChild className="h-auto">
                                            <Button variant="secondary" className="p-0">
                                                <Info className="text-neutral-60 dark:text-neutral-40" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent tabIndex={-1} sideOffset={5} align="center">
                                            <p>{currentDetailsSchema?.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        <div className="flex items-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            <Input
                                copyValue
                                value={item.value}
                                onChange={e => onValueChange(e, item.key)}
                                error={item.value.length === 0 || !validRegExp}
                                errorMessage={
                                    validRegExp
                                        ? translate("resources.terminals.errors.value_error")
                                        : translate("resources.terminals.errors.regExpValidation", {
                                              regExp: currentDetailsSchema?.validation_pattern
                                          })
                                }
                                type="text"
                            />
                        </div>

                        <div className="flex items-center justify-center border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                            <TrashButton
                                disabled={loading || currentDetailsSchema?.required}
                                onClick={() => handleDelete(item.key)}
                            />
                        </div>
                    </div>
                );
            })}

            {detailsSchema?.map(schema => {
                if (!detailsData.find(item => item.key === schema.key)?.key && schema.required) {
                    return (
                        <div
                            key={schema.key}
                            className={clsx(
                                "grid w-full grid-cols-[1fr,1fr,100px] items-start bg-green-50",
                                detailsData.length % 2
                                    ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                    : "bg-neutral-0 dark:bg-neutral-100"
                            )}>
                            <div className="flex items-center gap-2 border-b border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
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

                            <div className="flex items-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                                <Input disabled={true} value={schema.default_value || ""} />
                            </div>

                            <div className="flex items-center justify-center border-r border-neutral-40 px-4 py-3 text-neutral-90 dark:border-muted dark:text-neutral-0">
                                <Button disabled={loading} className="h-9 px-2" variant="default">
                                    <PlusCircle
                                        onClick={() => addDetailsData(schema.key, schema.default_value || "")}
                                    />
                                </Button>
                            </div>
                        </div>
                    );
                }
            })}

            <div
                className={clsx(
                    "grid w-full grid-cols-[1fr,1fr,100px] items-start bg-green-50",
                    detailsData.length % 2 ? "bg-neutral-20 dark:bg-neutral-bb-2" : "bg-neutral-0 dark:bg-neutral-100"
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
                        <PlusCircle onClick={() => addDetailsData()} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
