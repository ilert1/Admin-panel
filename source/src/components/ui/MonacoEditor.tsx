import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import { LoadingAlertDialog } from "./loading";
import { useCallback } from "react";

interface MonacoEditorProps {
    height?: string;
    width?: string;
    code: string;
    disabled?: boolean;
    setCode: (value: string) => void;
    onErrorsChange: (hasErrors: boolean) => void;
    onValidChange: (isValid: boolean) => void;
}

export const MonacoEditor = (props: MonacoEditorProps) => {
    const { code, disabled = false, setCode, onErrorsChange, onValidChange } = props;

    const validateCode = useCallback(
        (value: string) => {
            try {
                const parsed = JSON.parse(value || "{}");
                if (value.trim() === "" || Object.keys(parsed).length === 0) {
                    onValidChange(false);
                } else {
                    onValidChange(true);
                }
            } catch (error) {
                onValidChange(false);
            }
        },
        [onValidChange]
    );

    const handleEditorChange = useCallback(
        (value: string | undefined) => {
            if (value !== undefined) {
                setCode(value);
                validateCode(value);
            }
        },
        [setCode, validateCode]
    );

    const handleValidation = useCallback(
        (markers: monaco.editor.IMarker[]) => {
            onErrorsChange(markers.length > 0);
        },
        [onErrorsChange]
    );

    const handleEditorDidMount = useCallback((monaco: any) => {
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "identifier", foreground: "008C99" },
                { token: "keyword", foreground: "008C99" },
                { token: "number", foreground: "008C99" },
                { token: "string", foreground: "008C99" },
                { token: "comment", foreground: "FFD700" },
                { token: "delimiter", foreground: "008C99" },
                { token: "operator", foreground: "008C99" },
                { foreground: "008C99", token: "string" },
                { token: "string.key.json", foreground: "008C99" },
                { token: "delimiter.bracket", foreground: "008C99" },
                { token: "delimiter.curly", foreground: "008C99" }
            ],
            colors: {
                "editor.background": "#13232C",
                "editorLineNumber.foreground": "#5C5C5C",
                "editor.foreground": "#008C99"
            }
        });
    }, []);

    return (
        <div className="h-full w-full border border-neutral-50 rounded-[4px] py-2 overflow-hidden">
            <Editor
                width={"90%"}
                height={"144px"}
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
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastColumn: 0,
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    glyphMargin: false,
                    lineNumbersMinChars: 2,
                    lineDecorationsWidth: 1,
                    readOnly: disabled,
                    automaticLayout: true
                }}
                beforeMount={handleEditorDidMount}
            />
        </div>
    );
};
