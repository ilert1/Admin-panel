import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslate } from "react-admin";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    CallbackHistoryReadRequestHeaders,
    CallbackHistoryReadRequestParams,
    CallbackHistoryReadResponseHeaders,
    CallbackHistoryReadRequestBody,
    CallbackHistoryReadResponseBody
} from "@/api/callbridge/blowFishCallBridgeAPIService.schemas";
import { MonacoEditor } from "@/components/ui/MonacoEditor";

interface CallbridgeHistoryTechnicalInfoShowProps {
    technicalInfo: {
        request_headers: CallbackHistoryReadRequestHeaders;
        request_params: CallbackHistoryReadResponseHeaders;
        response_headers?: CallbackHistoryReadRequestParams | null;
    };
    bodies: {
        request_body?: CallbackHistoryReadRequestBody;
        response_body?: CallbackHistoryReadResponseBody;
    };
}

export const CallbridgeHistoryTechnicalInfoShow = (props: CallbridgeHistoryTechnicalInfoShowProps) => {
    const { technicalInfo, bodies } = props;
    const translate = useTranslate();

    return (
        <div className="flex flex-col gap-4 rounded-8 bg-neutral-0 px-8 py-4 dark:bg-neutral-100">
            <h3 className="text-2xl text-neutral-90 dark:text-neutral-30">
                {translate("resources.callbridge.history.show.technicalInfo")}
            </h3>

            {Object.keys(technicalInfo).length > 0 ? (
                <Accordion type="multiple">
                    {Object.keys(technicalInfo)
                        .concat(Object.keys(bodies))
                        .map(key => {
                            const info = technicalInfo[key as keyof typeof technicalInfo];
                            const body = bodies[key as keyof typeof bodies];
                            let isJSON = false;
                            try {
                                isJSON = !!JSON.parse(body ?? "{}");
                            } catch (e) {
                                isJSON = false;
                            }

                            return (
                                <AccordionItem key={key} value={key}>
                                    <AccordionTrigger className="text-xs text-neutral-90 dark:text-neutral-0 sm:text-sm md:text-base">
                                        {key}
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        {key === "request_body" || key === "response_body" ? (
                                            <div className="h-28 min-h-[300px] w-full">
                                                <MonacoEditor
                                                    disabled
                                                    height="h-full"
                                                    width="100%"
                                                    onMountEditor={() => {}}
                                                    onErrorsChange={() => {}}
                                                    onValidChange={() => {}}
                                                    code={
                                                        isJSON
                                                            ? JSON.stringify(JSON.parse(body ?? "{}"), null, "\t")
                                                            : (body ?? "{}")
                                                    }
                                                    setCode={() => {}}
                                                />
                                            </div>
                                        ) : (
                                            <Table key={key}>
                                                <TableHeader>
                                                    <TableRow className="relative bg-green-50 hover:bg-green-50">
                                                        {["key", "value"].map((header, j) => {
                                                            return (
                                                                <TableHead
                                                                    key={j}
                                                                    className="border border-neutral-40 px-4 py-[9px] text-left text-base leading-4 text-white dark:border-muted">
                                                                    {translate(
                                                                        `resources.callbridge.history.show.technicalInfoTable.${header}`
                                                                    )}
                                                                </TableHead>
                                                            );
                                                        })}
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {info && Object.keys(info).length > 0 ? (
                                                        Object.keys(info).map((key, rowIndex) => {
                                                            return (
                                                                <TableRow className="border-muted" key={key}>
                                                                    <TableCell
                                                                        colSpan={1}
                                                                        className={cn(
                                                                            "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                                                            rowIndex % 2
                                                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                                                : "bg-neutral-0 dark:bg-neutral-100"
                                                                        )}>
                                                                        {key}
                                                                    </TableCell>

                                                                    <TableCell
                                                                        className={cn(
                                                                            "relative border border-neutral-40 py-2 text-sm text-neutral-90 dark:border-muted dark:text-neutral-0",
                                                                            rowIndex % 2
                                                                                ? "bg-neutral-20 dark:bg-neutral-bb-2"
                                                                                : "bg-neutral-0 dark:bg-neutral-100"
                                                                        )}>
                                                                        {info[key]}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={2} className="text-center">
                                                                {translate(
                                                                    "resources.callbridge.history.show.technicalInfoNotFound"
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                </Accordion>
            ) : (
                <span className="self-center text-lg text-neutral-50">
                    {translate("resources.callbridge.history.show.technicalInfoNotFound")}
                </span>
            )}
        </div>
    );
};
