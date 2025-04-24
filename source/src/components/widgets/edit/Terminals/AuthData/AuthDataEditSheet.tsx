import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useRefresh, useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../../components/CloseSheetXButton";
import { AuthDataJsonToggle } from "./AuthDataJsonToggle";
import { SetStateAction, useMemo, useState } from "react";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/Button";
import { TerminalAuth } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { terminalEndpointsSetTerminalAuthEnigmaV1ProviderProviderNameTerminalTerminalIdSetAuthPut } from "@/api/enigma/terminal/terminal";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { ColumnDef } from "@tanstack/react-table";
import { TextField } from "@/components/ui/text-field";
import { SimpleTable } from "@/components/widgets/shared";
import { TableTypes } from "@/components/widgets/shared/SimpleTable";

interface IAuthDataEditSheet {
    open: boolean;
    terminalId: string;
    provider: string;
    originalAuthData: TerminalAuth | undefined;
    onOpenChange: (state: boolean) => void;
}

export const AuthDataEditSheet = ({
    originalAuthData,
    terminalId,
    provider,
    open,
    onOpenChange
}: IAuthDataEditSheet) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [authData, setAuthData] = useState(() => originalAuthData);
    const [stringAuthData, setStringAuthData] = useState(() => JSON.stringify(originalAuthData, null, 2));
    const [showJson, setShowJson] = useState(true);
    const [disabledBtn, setDisabledBtn] = useState(false);

    const parseAuthData = useMemo(
        () => (authData ? Object.keys(authData).map(key => ({ key, value: authData[key] as string })) : []),
        [authData]
    );

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

    const toggleJsonHandler = (state: SetStateAction<boolean>) => {
        try {
            if (state) {
                setStringAuthData(JSON.stringify(authData, null, 2));
            } else {
                setAuthData(JSON.parse(stringAuthData));
            }

            setShowJson(state);
        } catch (error) {
            appToast("error", translate("resources.terminals.errors.auth_data_toggle"));
        }
    };

    const cancelHandler = () => {
        setAuthData(originalAuthData);
        setStringAuthData(JSON.stringify(originalAuthData, null, 2));
        onOpenChange(false);
    };

    const submitHandler = async () => {
        try {
            setDisabledBtn(true);

            const res = await terminalEndpointsSetTerminalAuthEnigmaV1ProviderProviderNameTerminalTerminalIdSetAuthPut(
                provider,
                terminalId,
                {
                    auth: authData || {}
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

            refresh();
            onOpenChange(false);
        } catch (error) {
            if (error instanceof Error) appToast("error", error.message);
        } finally {
            setDisabledBtn(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="bottom-auto top-[84px] m-0 flex h-auto w-full flex-col gap-0 border-0 p-0 sm:max-w-[1015px]"
                tabIndex={-1}
                close={false}>
                <div className="flex-shrink-0 p-4 !pb-0 md:p-[42px]">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="!text-display-1">
                            {translate("resources.terminals.fields.auth")}
                        </SheetTitle>
                        <CloseSheetXButton onOpenChange={onOpenChange} />
                    </div>
                </div>

                <SheetDescription />

                <div className="mb-4 flex flex-col gap-6 p-4 md:mb-[42px] md:px-[42px]">
                    <div className="self-end">
                        <AuthDataJsonToggle showJson={showJson} setShowJson={toggleJsonHandler} />
                    </div>

                    {showJson ? (
                        <MonacoEditor
                            height="144px"
                            width="100%"
                            onMountEditor={() => setMonacoEditorMounted(true)}
                            onErrorsChange={setHasErrors}
                            onValidChange={setIsValid}
                            code={stringAuthData}
                            setCode={setStringAuthData}
                        />
                    ) : (
                        <SimpleTable columns={authDataColumns} data={parseAuthData} tableType={TableTypes.COLORED} />
                    )}

                    <div className="ml-auto mt-6 flex w-full flex-col space-x-0 p-2 sm:flex-row sm:space-x-2 md:w-2/5">
                        <Button
                            onClick={submitHandler}
                            disabled={(hasErrors && !isValid) || !monacoEditorMounted || disabledBtn}
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
                            onClick={cancelHandler}>
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
