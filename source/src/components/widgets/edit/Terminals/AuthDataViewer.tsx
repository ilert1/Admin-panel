import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { OnMount } from "@monaco-editor/react";
import clsx from "clsx";
import { MouseEvent, useMemo, useState } from "react";
import { useTranslate } from "react-admin";
import { SimpleTable } from "../../shared";
import { ColumnDef } from "@tanstack/react-table";
import { TableTypes } from "../../shared/SimpleTable";
import { TextField } from "@/components/ui/text-field";

interface IAuthDataViewer {
    authData: string;
    setAuthData?: (value: string) => void;
    onErrorsChange?: (hasErrors: boolean) => void;
    onValidChange?: (isValid: boolean) => void;
    onMountEditor?: OnMount;
    disabledEditJson?: boolean;
    titleClassName?: string;
    tableClassName?: string;
}

export const AuthDataViewer = ({
    authData,
    setAuthData = () => {},
    onMountEditor = () => {},
    onErrorsChange = () => {},
    onValidChange = () => {},
    disabledEditJson = true,
    titleClassName = "",
    tableClassName = ""
}: IAuthDataViewer) => {
    const translate = useTranslate();

    const [showJson, setShowJson] = useState(false);

    const authDataColumns: ColumnDef<{ [key: string]: string }>[] = [
        {
            id: "key",
            accessorKey: "key",
            header: "Key",
            cell: ({ row }) => {
                return <TextField text={row.original.key} wrap lineClamp />;
            }
        },
        {
            id: "value",
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => {
                return <TextField text={row.original.value} type="secret" copyValue />;
            }
        }
    ];

    const toggleJsonHandler = (e: MouseEvent) => {
        e.preventDefault();
        setShowJson(prev => !prev);
    };

    const parseAuthData = useMemo(() => {
        if (!showJson) {
            try {
                const parse = JSON.parse(authData);

                return Object.keys(parse).map(key => ({ key, value: parse[key] }));
            } catch (error) {
                console.log(error);
                return [];
            }
        }

        return [];
    }, [authData, showJson]);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-1">
                <p className={clsx("text-note-1 !text-neutral-90 dark:!text-neutral-30", titleClassName)}>
                    {translate("resources.terminals.fields.auth")}
                </p>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <button
                            onClick={toggleJsonHandler}
                            className={clsx(
                                "flex w-11 items-center rounded-[50px] p-0.5 outline outline-1",
                                showJson
                                    ? "bg-neutral-100 outline-transparent dark:bg-green-50 dark:outline-green-40"
                                    : "bg-transparent outline-green-40 dark:outline-green-50"
                            )}>
                            <span
                                className={clsx(
                                    "h-5 w-5 rounded-full outline outline-1 transition-all",
                                    showJson
                                        ? "translate-x-full bg-neutral-0 outline-transparent dark:bg-neutral-100 dark:outline-green-40"
                                        : "translate-x-0 bg-green-50 outline-green-40 dark:bg-green-50 dark:outline-transparent"
                                )}
                            />
                        </button>
                        <p className="text-base text-neutral-90 dark:text-neutral-30">JSON</p>
                    </label>

                    {/* <Button>{translate("app.ui.actions.edit")}</Button> */}
                </div>
            </div>

            {showJson ? (
                <MonacoEditor
                    disabled={disabledEditJson}
                    height="144px"
                    width="100%"
                    onMountEditor={onMountEditor}
                    onErrorsChange={onErrorsChange}
                    onValidChange={onValidChange}
                    code={authData}
                    setCode={setAuthData}
                />
            ) : (
                <SimpleTable
                    columns={authDataColumns}
                    data={parseAuthData}
                    tableType={TableTypes.COLORED}
                    className={tableClassName}
                />
            )}
        </div>
    );
};
