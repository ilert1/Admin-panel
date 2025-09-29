import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useRefresh, useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../../components/CloseSheetXButton";
import { JsonToggle } from "../JsonToggle";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/Button";
import { BaseFieldConfig, TerminalBaseAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { AuthDataEditTable } from "./AuthDataEditTable";
import {
    terminalEndpointsDeleteAuthKeysEnigmaV1TerminalTerminalIdAuthKeysDelete,
    terminalEndpointsPatchTerminalAuthEnigmaV1TerminalTerminalIdAuthPatch
} from "@/api/enigma/terminal/terminal";

interface IAuthDataEditSheet {
    open: boolean;
    terminalId: string;
    originalAuthData: TerminalBaseAuth | undefined;
    onOpenChange: (state: boolean) => void;
    authSchema?: BaseFieldConfig[];
}

export const AuthDataEditSheet = ({
    originalAuthData,
    terminalId,
    open,
    onOpenChange,
    authSchema
}: IAuthDataEditSheet) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const parseAuthData = (data: TerminalBaseAuth | undefined) =>
        data ? Object.keys(data).map((key, index) => ({ id: index, key, value: data[key] as string })) : [];

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [authData, setAuthData] = useState(() => parseAuthData(originalAuthData));
    const [stringAuthData, setStringAuthData] = useState(() => JSON.stringify(originalAuthData || {}, null, 2));
    const [showJson, setShowJson] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);

    const arrayAuthDataToObject = useCallback(
        () => Object.fromEntries(authData.map(item => [item.key, item.value])),
        [authData]
    );

    const filteringAuthSchema = useMemo(
        () => authSchema?.filter(item => Object.keys(originalAuthData || {}).includes(item.key)),
        [originalAuthData, authSchema]
    );
    ``;

    const toggleJsonHandler = (state: SetStateAction<boolean>) => {
        try {
            if (state) {
                if (authData.find(item => item.key === "" || item.value === "")) {
                    throw new Error();
                }
                setStringAuthData(JSON.stringify(arrayAuthDataToObject(), null, 2));
            } else {
                if (hasErrors || !isValid || !monacoEditorMounted) {
                    throw new Error();
                }
                setAuthData(() => parseAuthData(JSON.parse(stringAuthData)));
            }

            setShowJson(state);
        } catch (error) {
            appToast("error", translate("resources.terminals.errors.auth_data_toggle"));
        }
    };

    const onOpenChangeHandler = (state: boolean) => {
        if (!state) {
            setAuthData(() => parseAuthData(originalAuthData));
            setStringAuthData(() => JSON.stringify(originalAuthData || {}, null, 2));
        }

        onOpenChange(state);
    };

    useEffect(() => {
        setAuthData(() => parseAuthData(originalAuthData));
        setStringAuthData(() => JSON.stringify(originalAuthData || {}, null, 2));
    }, [originalAuthData]);

    const buttonSaveDisabled = useMemo(() => {
        const stringifyOriginalAuthData = JSON.stringify(originalAuthData || {}, null, 2);
        const stringifyAuthData = JSON.stringify(arrayAuthDataToObject(), null, 2);

        return (
            (!showJson &&
                (!!authData.find(item => item.key === "" || item.value === "") ||
                    stringifyOriginalAuthData === stringifyAuthData)) ||
            (showJson &&
                (hasErrors || !isValid || !monacoEditorMounted || stringifyOriginalAuthData === stringAuthData)) ||
            disabledBtn
        );
    }, [
        arrayAuthDataToObject,
        authData,
        disabledBtn,
        hasErrors,
        isValid,
        monacoEditorMounted,
        originalAuthData,
        showJson,
        stringAuthData
    ]);

    const submitHandler = async () => {
        try {
            setDisabledBtn(true);

            const currentAuthData = showJson ? JSON.parse(stringAuthData) : arrayAuthDataToObject();
            const authDataToUpdate: TerminalBaseAuth = {};

            // Проверка какие ключи нужно добавить или изменить
            Object.keys(currentAuthData).forEach(key => {
                if (!originalAuthData?.[key] || originalAuthData[key] !== currentAuthData[key]) {
                    authDataToUpdate[key] = currentAuthData[key];
                }
            });

            // Проверка какие ключи нужно удалить
            const authDataKeysToRemove = Object.keys(originalAuthData || {}).filter(key => !currentAuthData[key]);

            if (Object.keys(authDataToUpdate).length > 0) {
                const res = await terminalEndpointsPatchTerminalAuthEnigmaV1TerminalTerminalIdAuthPatch(
                    terminalId,
                    {
                        auth: authDataToUpdate
                    },
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );

                if ("data" in res.data && !res.data.success) {
                    throw new Error(res.data.error?.error_message);
                } else if ("detail" in res.data) {
                    throw new Error(res.data.detail?.[0].msg);
                }
            }

            if (authDataKeysToRemove.length > 0) {
                const res = await terminalEndpointsDeleteAuthKeysEnigmaV1TerminalTerminalIdAuthKeysDelete(
                    terminalId,
                    {
                        keys: authDataKeysToRemove
                    },
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        }
                    }
                );

                if ("data" in res.data && !res.data.success) {
                    throw new Error(res.data.error?.error_message);
                } else if ("detail" in res.data) {
                    throw new Error(res.data.detail?.[0].msg);
                }
            }

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setDisabledBtn(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChangeHandler}>
            <SheetContent
                className="bottom-auto top-[84px] m-0 flex h-auto w-full flex-col gap-0 border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 !pb-0 md:p-[42px]">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="!text-display-1">
                            {translate("resources.terminals.fields.auth")}
                        </SheetTitle>
                        <CloseSheetXButton onOpenChange={onOpenChangeHandler} />
                    </div>
                </div>

                <SheetDescription />

                <div className="mb-4 flex flex-col gap-6 p-4 md:mb-[42px] md:px-[42px]">
                    <div className="self-end">
                        <JsonToggle showJson={showJson} setShowJson={toggleJsonHandler} />
                    </div>

                    {showJson ? (
                        <MonacoEditor
                            height="h-48"
                            width="100%"
                            onMountEditor={() => setMonacoEditorMounted(true)}
                            onErrorsChange={setHasErrors}
                            onValidChange={setIsValid}
                            code={stringAuthData}
                            setCode={setStringAuthData}
                        />
                    ) : (
                        <AuthDataEditTable
                            loading={disabledBtn}
                            authData={authData}
                            onChangeAuthData={setAuthData}
                            authSchema={filteringAuthSchema}
                        />
                    )}

                    <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                        <Button
                            onClick={submitHandler}
                            disabled={buttonSaveDisabled}
                            type="submit"
                            variant="default"
                            className="flex-1">
                            {translate("app.ui.actions.save")}
                        </Button>

                        <Button
                            disabled={disabledBtn}
                            type="button"
                            variant="outline_gray"
                            className="mt-4 w-full flex-1 sm:mt-0 sm:w-1/2"
                            onClick={() => onOpenChangeHandler(false)}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
