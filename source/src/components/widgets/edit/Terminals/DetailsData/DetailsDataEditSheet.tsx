import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useRefresh, useTranslate } from "react-admin";
import { CloseSheetXButton } from "../../../components/CloseSheetXButton";
import { JsonToggle } from "../JsonToggle";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { MonacoEditor } from "@/components/ui/MonacoEditor";
import { Button } from "@/components/ui/Button";
import { BaseFieldConfig, TerminalReadDetails, TerminalUpdate } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import { useAppToast } from "@/components/ui/toast/useAppToast";
import { TerminalsDataProvider } from "@/data";
import { DetailsDataEditTable } from "./DetailsDataEditTable";

interface IDetailsDataEditSheet {
    open: boolean;
    terminalId: string;
    originalDetailsData: TerminalReadDetails | undefined;
    onOpenChange: (state: boolean) => void;
    detailsSchema?: BaseFieldConfig[];
}

export const DetailsDataEditSheet = ({
    originalDetailsData,
    terminalId,
    open,
    onOpenChange,
    detailsSchema
}: IDetailsDataEditSheet) => {
    const terminalsDataProvider = new TerminalsDataProvider();
    const translate = useTranslate();
    const refresh = useRefresh();
    const appToast = useAppToast();

    const parseAuthData = (data: TerminalReadDetails | undefined) =>
        data ? Object.keys(data).map((key, index) => ({ id: index, key, value: data[key] as string })) : [];

    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [monacoEditorMounted, setMonacoEditorMounted] = useState(false);
    const [detailsData, setDetailsData] = useState(() => parseAuthData(originalDetailsData));
    const [stringDetailsData, setStringDetailsData] = useState(() =>
        JSON.stringify(originalDetailsData || {}, null, 2)
    );
    const [showJson, setShowJson] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);

    const arrayDetailsDataToObject = useCallback(
        () => Object.fromEntries(detailsData.map(item => [item.key, item.value])),
        [detailsData]
    );

    const toggleJsonHandler = (state: SetStateAction<boolean>) => {
        try {
            if (state) {
                if (detailsData.find(item => item.key === "" || item.value === "")) {
                    throw new Error();
                }
                setStringDetailsData(JSON.stringify(arrayDetailsDataToObject(), null, 2));
            } else {
                if (hasErrors || !isValid || !monacoEditorMounted) {
                    throw new Error();
                }
                setDetailsData(() => parseAuthData(JSON.parse(stringDetailsData)));
            }

            setShowJson(state);
        } catch (error) {
            appToast("error", translate("resources.terminals.errors.auth_data_toggle"));
        }
    };

    const onOpenChangeHandler = (state: boolean) => {
        if (!state) {
            setDetailsData(() => parseAuthData(originalDetailsData));
            setStringDetailsData(() => JSON.stringify(originalDetailsData || {}, null, 2));
        }

        onOpenChange(state);
    };

    useEffect(() => {
        setDetailsData(() => parseAuthData(originalDetailsData));
        setStringDetailsData(() => JSON.stringify(originalDetailsData || {}, null, 2));
    }, [originalDetailsData]);

    const buttonSaveDisabled = useMemo(() => {
        const stringifyOriginalDetailsData = JSON.stringify(originalDetailsData || {}, null, 2);
        const stringifyDetailsData = JSON.stringify(arrayDetailsDataToObject(), null, 2);

        return (
            (!showJson &&
                (!!detailsData.find(item => item.key === "" || item.value === "") ||
                    stringifyOriginalDetailsData === stringifyDetailsData)) ||
            (showJson &&
                (hasErrors ||
                    !isValid ||
                    !monacoEditorMounted ||
                    stringifyOriginalDetailsData === stringDetailsData)) ||
            disabledBtn
        );
    }, [
        arrayDetailsDataToObject,
        detailsData,
        disabledBtn,
        hasErrors,
        isValid,
        monacoEditorMounted,
        originalDetailsData,
        showJson,
        stringDetailsData
    ]);

    const submitHandler = async () => {
        const arrayOfRequiredFields = detailsSchema?.filter(
            schema => !detailsData.find(item => item.key === schema.key) && schema.required
        );

        if (arrayOfRequiredFields && arrayOfRequiredFields.length > 0) {
            appToast(
                "error",
                translate("resources.terminals.errors.schemaRequiredFields", {
                    keys: arrayOfRequiredFields.map(item => item.key).join(", ")
                })
            );
            return;
        }

        try {
            setDisabledBtn(true);

            const detailsData = showJson ? JSON.parse(stringDetailsData) : arrayDetailsDataToObject();

            await terminalsDataProvider.update("terminals", {
                id: terminalId,
                data: {
                    details: detailsData
                } as TerminalUpdate,
                previousData: undefined
            });

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
                            {translate("resources.terminals.fields.details")}
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
                            code={stringDetailsData}
                            setCode={setStringDetailsData}
                        />
                    ) : (
                        <DetailsDataEditTable
                            loading={disabledBtn}
                            detailsData={detailsData}
                            onChangeDetailsData={setDetailsData}
                            detailsSchema={detailsSchema}
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
