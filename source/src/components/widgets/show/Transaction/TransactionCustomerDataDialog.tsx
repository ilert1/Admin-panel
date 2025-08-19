/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslate } from "react-admin";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { JsonForm } from "../../components/JsonForm";

interface TransactionCustomerDataDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    schema?: any;
    uiSchema?: any;
    data?: any;
}

export const TransactionCustomerDataDialog = (props: TransactionCustomerDataDialogProps) => {
    const translate = useTranslate();
    const { open, onOpenChange, schema, uiSchema, data } = props;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[716px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {translate("resources.transactions.show.customerData")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div>
                        <JsonForm
                            formData={data}
                            schema={schema}
                            uischema={uiSchema}
                            setFormData={() => {}}
                            showNull={false}
                        />
                        <div className="flex justify-end">
                            <Button onClick={() => onOpenChange(false)}>{translate("app.ui.actions.close")}</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
