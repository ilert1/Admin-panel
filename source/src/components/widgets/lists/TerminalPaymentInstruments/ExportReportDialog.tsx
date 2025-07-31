import { authProvider } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslate } from "react-admin";

interface ExportReportDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    handleExport: (terminalId: string) => void;
    terminalId: string;
}
export const ExportReportDialog = (props: ExportReportDialogProps) => {
    const { open, onOpenChange = () => {}, handleExport, terminalId } = props;
    const translate = useTranslate();
    const { checkAuth } = authProvider;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                disableOutsideClick
                className="max-w-full !overflow-y-auto bg-muted sm:max-h-[100dvh] sm:w-[400px]">
                <DialogHeader>
                    <DialogTitle className="mb-4 text-center">
                        {translate("resources.paymentSettings.reports.downloadReport")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:self-end">
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full"
                            onClick={async () => {
                                await checkAuth({});
                                handleExport(terminalId);
                                onOpenChange(false);
                            }}>
                            {translate("app.ui.actions.confirm")}
                        </Button>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline_gray"
                            type="button"
                            className="hover:border-neutral-scale-100 w-full rounded-4 border border-neutral-50">
                            {translate("app.ui.actions.cancel")}
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
