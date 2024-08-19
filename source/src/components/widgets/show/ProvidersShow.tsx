import { useDataProvider, useShowController, useTranslate } from "react-admin";
import { useQuery } from "react-query";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ProvidersShow = (props: { id: string }) => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const context = useShowController({ id: props.id });
    const [code, setCode] = useState(``);

    useEffect(() => {
        if (context.record && context.record.methods) {
            console.log(context.record.methods);
            setCode(JSON.stringify(context.record.methods, null, 2));
        }
    }, [context.record]);

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
                    <CodeEditor
                        id="editor"
                        className="max-w-96"
                        language="js"
                        value={code}
                        placeholder={translate("resources.providers.fields.enterMethods")}
                        onChange={evn => setCode(evn.target.value)}
                        padding={15}
                        disabled
                        style={{
                            backgroundColor: "bg-neutral-40",
                            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                            marginBottom: "10px"
                        }}
                    />
                </div>
            </div>
        );
    }
};
