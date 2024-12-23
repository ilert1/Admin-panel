import { BeforeMount, Editor, OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { LoadingAlertDialog } from "./loading";
import { useCallback } from "react";
import { useTheme } from "../providers";

interface MonacoEditorProps {
    height?: string;
    width?: string;
    code: string;
    disabled?: boolean;
    setCode: (value: string) => void;
    onErrorsChange: (hasErrors: boolean) => void;
    onValidChange: (isValid: boolean) => void;
    onMountEditor?: OnMount;
}

export const MonacoEditor = (props: MonacoEditorProps) => {
    const { code, disabled = false, setCode, onErrorsChange, onValidChange, onMountEditor = () => {} } = props;
    const { theme } = useTheme();

    const isDark = theme === "dark";

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

    const handleEditorChange = useCallback<OnChange>(
        value => {
            if (value !== undefined) {
                setCode(value);
                validateCode(value);
            }
        },
        [setCode, validateCode]
    );

    const handleValidation = useCallback<OnValidate>(
        markers => {
            onErrorsChange(markers.length > 0);
        },
        [onErrorsChange]
    );

    const handleEditorDidMount = useCallback<BeforeMount>(
        monaco => {
            const mainColor = isDark ? "008C99" : "#237648";
            const editorTheme = isDark ? "vs-dark" : "vs";
            return monaco.editor.defineTheme("myCustomTheme", {
                base: editorTheme,
                inherit: true,
                rules: [
                    { token: "identifier", foreground: mainColor },
                    { token: "keyword", foreground: mainColor },
                    { token: "number", foreground: mainColor },
                    { token: "string", foreground: mainColor },
                    { token: "comment", foreground: "FFD700" },
                    { token: "delimiter", foreground: mainColor },
                    { token: "operator", foreground: mainColor },
                    { foreground: mainColor, token: "string" },
                    { token: "string.key.json", foreground: mainColor },
                    { token: "delimiter.bracket", foreground: mainColor },
                    { token: "delimiter.curly", foreground: mainColor }
                ],

                ...(isDark
                    ? {
                          colors: {
                              "editor.background": "#13232C",
                              "editorLineNumber.foreground": "#5C5C5C",
                              "editor.foreground": "#008C99"
                          }
                      }
                    : { colors: {} })
            });
        },
        [isDark]
    );

    // const handleEditorDidMount = useCallback<BeforeMount>(monaco => {
    //     monaco.editor.defineTheme("myCustomTheme", {
    //         base: "vs",
    //         inherit: true,
    //         rules: [
    //             { token: "identifier", foreground: "#237648" },
    //             { token: "keyword", foreground: "#237648" },
    //             { token: "number", foreground: "#237648" },
    //             { token: "string", foreground: "#237648" },
    //             { token: "comment", foreground: "FFD700" },
    //             { token: "delimiter", foreground: "#237648" },
    //             { token: "operator", foreground: "#237648" },
    //             { foreground: "#237648", token: "string" },
    //             { token: "string.key.json", foreground: "#237648" },
    //             { token: "delimiter.bracket", foreground: "#237648" },
    //             { token: "delimiter.curly", foreground: "#237648" }
    //         ],
    //         colors: {
    //             // "editor.background": "#ffffff",
    //             // "editorLineNumber.foreground": "#ffffff",
    //             // "editor.foreground": "#237648"
    //         }
    //     });
    // }, []);

    return (
        <div className="h-48 w-full border border-neutral-50 rounded-[4px] py-2 overflow-hidden">
            <Editor
                width={"99%"}
                defaultLanguage="json"
                value={code}
                theme="myCustomTheme"
                // theme="vs-light"
                onChange={handleEditorChange}
                onValidate={handleValidation}
                onMount={onMountEditor}
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
