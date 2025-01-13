import { BeforeMount, Editor, OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { LoadingBlock } from "./loading";
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
            const colors = isDark
                ? {
                      "editor.background": "#13232C",
                      "editorLineNumber.foreground": "#5C5C5C",
                      "editor.foreground": "#008C99"
                  }
                : null;
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
                colors: {
                    "editor.lineHighlightBackground": "#00000000",
                    "editor.lineHighlightBorder": "#00000000",
                    ...colors
                }
            });
        },
        [isDark]
    );

    return (
        <div className="h-48 w-full border border-neutral-50 rounded-[4px] py-2 bg-white dark:bg-muted overflow-hidden">
            <Editor
                width={"99%"}
                defaultLanguage="json"
                value={code}
                theme="myCustomTheme"
                onChange={handleEditorChange}
                onValidate={handleValidation}
                onMount={onMountEditor}
                loading={<LoadingBlock />}
                options={{
                    fontSize: 14,
                    lineHeight: 20,
                    fontWeight: "400",
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    scrollbar: {
                        vertical: "auto",
                        horizontal: "auto",
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    },
                    stickyScroll: {
                        enabled: false
                    },
                    overviewRulerLanes: 0,
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
