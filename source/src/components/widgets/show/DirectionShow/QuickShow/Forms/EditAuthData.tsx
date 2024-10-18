import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { LoadingAlertDialog } from "@/components/ui/loading";
import { useEffect, useState } from "react";
import { useTheme, useTranslate } from "react-admin";
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";

interface EditAuthDataProps {
    open: boolean;
    id: string;
    onOpenChange: (state: boolean) => void;
}

export const EditAuthData = (props: EditAuthDataProps) => {
    const { open, id, onOpenChange } = props;

    const translate = useTranslate();
    // const theme = useTheme();

    const [code, setCode] = useState("{}");
    const [hasErrors, setHasErrors] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // Определяем кастомную тему при монтировании компонента
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#13232C"
            }
        });
    }, []); // Только при монтировании компонента

    // const handleEditorDidMount = (editor: any, monaco: any) => {
    //     monaco.editor.setTheme(`vs-${theme}`);
    // };
    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            validateCode(value);
        }
    };
    const handleValidation = (markers: monaco.editor.IMarker[]) => {
        console.log(hasErrors);
        setHasErrors(markers.length > 0);
    };

    const validateCode = (value: string) => {
        try {
            const parsed = JSON.parse(value || "{}");
            if (value.trim() === "" || Object.keys(parsed).length === 0) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } catch (error) {
            setIsValid(false);
        }
    };

    monaco.editor.defineTheme("myCustomTheme", {
        base: `vs`,
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#13232C"
        }
    });

    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme("myCustomTheme"); // Применяем тему после монтирования редактора
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[468px] h-[464px] bg-muted pb-0">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            <span className="text-display-4">
                                {translate("resources.direction.changeAuthDataHeader")}
                            </span>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                        <div className="text-title-1 mb-[24px]">
                            {translate("resources.direction.writeSecretPhrase")}
                        </div>
                        <div className="flex justify-start w-full text-note-1 pb-[4px]">
                            {translate("resources.direction.secretHelper")}
                        </div>
                        <div className="flex items-center">
                            <div className="border border-neutral-50 rounded-[4px] py-2">
                                <Editor
                                    height="20vh"
                                    width="398px"
                                    defaultLanguage="json"
                                    value={code}
                                    theme="myCustomTheme"
                                    onChange={handleEditorChange}
                                    onValidate={handleValidation}
                                    loading={<LoadingAlertDialog />}
                                    options={{
                                        fontSize: 14,
                                        lineHeight: 20,
                                        fontWeight: "400",
                                        scrollBeyondLastLine: false, // Показ всех видимых строк
                                        minimap: { enabled: false }, // Отключение миникарты (если не нужна)
                                        wordWrap: "on", // Включение переноса строкб
                                        lineNumbers: "on"
                                    }}
                                    beforeMount={monaco => {
                                        monaco.editor.defineTheme("myCustomTheme", {
                                            base: "vs-dark",
                                            inherit: true,
                                            rules: [
                                                { token: "identifier", foreground: "008C99" }, // Общий цвет для всех идентификаторов
                                                { token: "keyword", foreground: "008C99" }, // Цвет для ключевых слов
                                                { token: "number", foreground: "008C99" }, // Цвет для чисел
                                                { token: "string", foreground: "008C99" }, // Цвет для строк
                                                { token: "comment", foreground: "FFD700" }, // Цвет для комментариев (жёлтый)б
                                                { token: "delimiter", foreground: "008C99" }, // Цвет для символов вроде {, }, (, ), ;
                                                { token: "operator", foreground: "008C99" },
                                                { foreground: "008C99", token: "string" },
                                                { token: "string.key.json", foreground: "008C99" }
                                            ],
                                            colors: {
                                                "editor.background": "#13232C", // Фон редактора
                                                "editorLineNumber.foreground": "#5C5C5C", // Цвет номеров строк
                                                "editor.foreground": "#008C99" // Общий цвет текста
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogFooter></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
// disabled={hasErrors || !isValid}
