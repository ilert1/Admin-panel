import { BeforeMount, Editor, OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { LoadingBlock } from "./loading";
import { useCallback } from "react";
import { useTheme } from "../providers";
import { cn } from "@/lib/utils";

type EditorSize = "h-48" | "h-96" | "h-full";

interface MonacoEditorProps {
    height?: EditorSize;
    width?: string;
    code: string;
    disabled?: boolean;
    setCode?: (value: string) => void;
    onErrorsChange?: (hasErrors: boolean) => void;
    onValidChange?: (isValid: boolean) => void;
    onMountEditor?: OnMount;

    allowEmptyValues?: boolean;
}

export const MonacoEditor = (props: MonacoEditorProps) => {
    const {
        code,

        disabled = false,
        height = "h-48",

        setCode = () => {},

        onErrorsChange,

        onValidChange,

        onMountEditor = () => {},

        allowEmptyValues = false
    } = props;
    const { theme } = useTheme();

    const isDark = theme === "dark";

    const validateCode = useCallback(
        (value: string) => {
            if (onValidChange) {
                try {
                    const parsed = JSON.parse(value);

                    if (
                        typeof parsed !== "object" ||
                        parsed === null ||
                        Array.isArray(parsed) ||
                        Object.keys(parsed).includes("") ||
                        (!allowEmptyValues && Object.values(parsed).includes(""))
                    ) {
                        onValidChange(false);
                    } else {
                        onValidChange(true);
                    }
                } catch (error) {
                    onValidChange(false);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (onErrorsChange) {
                onErrorsChange(markers.length > 0);
            }
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
        <div
            className={cn(
                "!mt-0 w-full overflow-hidden rounded-[4px] border border-neutral-50 bg-white py-2 dark:bg-muted",
                height
            )}>
            <style>{`.monaco-editor {outline: none !important;}`}</style>
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
                    lineNumbers: ln => '<span style="padding-left:5px">' + ln + "</span>",
                    scrollBeyondLastColumn: 0,
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    glyphMargin: false,
                    lineNumbersMinChars: 2,
                    lineDecorationsWidth: 1,
                    readOnly: disabled,
                    domReadOnly: disabled,
                    readOnlyMessage: { value: "" },
                    automaticLayout: true,
                    hover: { enabled: false }
                }}
                beforeMount={handleEditorDidMount}
                className="outline-none"
            />
        </div>
    );
};
