import { Button } from "@/components/ui/Button";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { OnMount } from "@monaco-editor/react";
import clsx from "clsx";
import { MouseEvent, useState } from "react";
import { useTranslate } from "react-admin";

interface IAuthDataViewer {
    authData: string;
    setAuthData: (value: string) => void;
    onErrorsChange: (hasErrors: boolean) => void;
    onValidChange: (isValid: boolean) => void;
    onMountEditor?: OnMount;
}

export const AuthDataViewer = ({
    authData,
    setAuthData,
    onMountEditor,
    onErrorsChange,
    onValidChange
}: IAuthDataViewer) => {
    const translate = useTranslate();

    const [showJson, setShowJson] = useState(true);

    const toggleJsonHandler = (e: MouseEvent) => {
        e.preventDefault();
        setShowJson(prev => !prev);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-1">
                <p className="text-note-1 !text-neutral-60 dark:!text-neutral-30">
                    {translate("resources.terminals.fields.auth")}
                </p>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <button
                            onClick={toggleJsonHandler}
                            className="flex w-11 items-center rounded-[50px] bg-green-50 p-0.5 outline outline-1 outline-offset-0 outline-green-40">
                            <span
                                className={clsx(
                                    "h-5 w-5 rounded-full bg-black outline outline-1 outline-offset-0 outline-green-40 transition-transform",
                                    showJson ? "translate-x-full" : "translate-x-0"
                                )}
                            />
                        </button>
                        <p className="text-base">JSON</p>
                    </label>

                    <Button>{translate("app.ui.actions.edit")}</Button>
                </div>
            </div>

            {showJson ? (
                <MonacoEditor
                    height="144px"
                    width="100%"
                    onMountEditor={onMountEditor}
                    onErrorsChange={onErrorsChange}
                    onValidChange={onValidChange}
                    code={authData}
                    setCode={setAuthData}
                />
            ) : (
                <div></div>
            )}
        </div>
    );
};
