// import { ExecutionMethodOutput } from "@/api/enigma/blowFishEnigmaAPIService.schemas";
// import { Button } from "@/components/ui/Button";
// import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useTranslate } from "react-admin";
// import { TableCellForStringMethod } from "./TableCellForStringMethod";
// import { TableCellForObjectMethod } from "./TableCellForObjectMethod";

// interface IProviderMethodsTable {
//     onEditClick: () => void;
//     onDeleteClick: () => void;
//     methodValue: ExecutionMethodOutput;
//     disabledProcess: boolean;
//     disabledEditButton?: boolean;
//     disabledDeleteButton?: boolean;
// }

// export const ProviderMethodsTable = ({
//     methodValue,
//     onEditClick,
//     onDeleteClick,
//     disabledProcess,
//     disabledEditButton,
//     disabledDeleteButton
// }: IProviderMethodsTable) => {
//     const translate = useTranslate();

//     return (
//         <div className="flex flex-col gap-4">
//             <Table>
//                 <TableHeader>
//                     <TableRow className="relative bg-green-50 hover:bg-green-50">
//                         {["Key", "Subkey", "Value"].map((header, j) => {
//                             return (
//                                 <TableHead
//                                     key={j}
//                                     className="border border-neutral-40 px-4 py-[9px] text-left text-base leading-4 text-white dark:border-muted">
//                                     {header}
//                                 </TableHead>
//                             );
//                         })}
//                     </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                     <TableCellForStringMethod methodKey="type" methodValue={methodValue} rowIndex={0} />
//                     <TableCellForStringMethod methodKey="execution_name" methodValue={methodValue} rowIndex={1} />
//                     <TableCellForStringMethod methodKey="task_queue" methodValue={methodValue} rowIndex={2} />

//                     <TableCellForObjectMethod methodKey="retry_policy" methodValue={methodValue} rowIndex={3} />
//                     <TableCellForObjectMethod methodKey="timeouts" methodValue={methodValue} rowIndex={4} />
//                 </TableBody>
//             </Table>

//             <div className="flex flex-wrap justify-end gap-2 md:gap-4">
//                 <Button disabled={disabledProcess || disabledEditButton} onClick={onEditClick}>
//                     {translate("app.ui.actions.edit")}
//                 </Button>

//                 <Button
//                     className="disabled:bg-neutral-40 disabled:dark:bg-neutral-70"
//                     disabled={disabledProcess || disabledDeleteButton}
//                     onClick={onDeleteClick}
//                     variant={"outline_gray"}>
//                     {translate("app.ui.actions.delete")}
//                 </Button>
//             </div>
//         </div>
//     );
// };
