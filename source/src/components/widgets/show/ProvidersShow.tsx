import { useShowController, useTranslate } from "react-admin";
import { Loading } from "@/components/ui/loading";
import { TextField } from "@/components/ui/text-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

export const ProvidersShow = (props: { id: string }) => {
    const translate = useTranslate();
    const context = useShowController({ id: props.id });

    const [code, setCode] = useState("{}");

    if (context.isLoading || !context.record) {
        return <Loading />;
    } else {
        return (
            <div className="flex flex-col gap-4 ">
                <div>
                    <TextField label={translate("resources.provider.fields.name")} text={context.record.name} />
                </div>
                <div>
                    <Label htmlFor="public_key" className="text-muted-foreground">
                        {translate("resources.provider.fields.pk")}
                    </Label>
                    <Textarea
                        id="public_key"
                        value={context.record.public_key || translate("resources.provider.pleaseCreate")}
                        disabled
                        className="max-w-96 h-80 disabled:cursor-auto"
                    />
                    <TextField
                        label={translate("resources.provider.fields.json_schema")}
                        text={context.record.fields_json_schema}
                    />
                </div>
                <div>
                    <Label htmlFor="editor" className="text-muted-foreground">
                        {translate("resources.provider.fields.code")}
                    </Label>
                    <MonacoEditor
                        height="144px"
                        width="100%"
                        code={code}
                        setCode={setCode}
                        onErrorsChange={() => {}}
                        onValidChange={() => {}}
                    />
                </div>
            </div>
        );
    }
};
