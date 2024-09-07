import { useShowController, useTranslate } from "react-admin";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/components/providers";
import { useState } from "react";

export const ProvidersShow = (props: { id: string }) => {
    const translate = useTranslate();
    const context = useShowController({ id: props.id });
    const { theme } = useTheme();
    const [isEditorReady, setIsEditorReady] = useState(false);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.setTheme(`vs-${theme}`);
        setIsEditorReady(true);
    };

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-4 ">
                <div>
                    <TextField label={translate("resources.providers.fields.name")} text={context.record.name} />
                </div>
                <div>
                    <Label htmlFor="public_key" className="text-muted-foreground">
                        {translate("resources.providers.fields.pk")}
                    </Label>
                    <Textarea
                        id="public_key"
                        value={context.record.public_key || translate("resources.providers.pleaseCreate")}
                        disabled
                        className="max-w-96 h-80 disabled:cursor-auto"
                    />
                    <TextField
                        label={translate("resources.providers.fields.json_schema")}
                        text={context.record.fields_json_schema}
                    />
                </div>
                <div>
                    <Label htmlFor="editor" className="text-muted-foreground">
                        {translate("resources.providers.fields.code")}
                    </Label>
                    <Editor
                        height="20vh"
                        defaultLanguage="json"
                        value={JSON.stringify(context.record.methods)}
                        loading={<LoadingAlertDialog />}
                        options={{
                            readOnly: true
                        }}
                        onMount={handleEditorDidMount}
                    />
                </div>
            </div>
        );
    }
};
