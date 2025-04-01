/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/Button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown } from "lucide-react";
import { useDataProvider, useTranslate } from "react-admin";
import { TerminalWithId } from "@/data/terminals";
import { useEffect, useState } from "react";

interface ITerminalSelectFilter {
    terminalFilterName: string;
    onChangeTerminalFilter: (terminal: string) => void;
    currentProvider: string;
    disabled: boolean;
}

export const TerminalSelectFilter = ({
    terminalFilterName,
    onChangeTerminalFilter,
    currentProvider,
    disabled
}: ITerminalSelectFilter) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();

    const [open, setOpen] = useState(false);

    const {
        data: allTerminalsList,
        refetch: refetchAllTerminalsList,
        isRefetching,
        isLoading,
        isFetched
    } = useQuery({
        queryKey: ["terminals", "getList", "allTerminalsList"],
        queryFn: async ({ signal }) =>
            await dataProvider.getList<TerminalWithId>(`${currentProvider}/terminal`, {
                pagination: { perPage: 10000, page: 1 },
                filter: { sort: "verbose_name", asc: "ASC" },
                signal
            }),
        select: data => data?.data,
        enabled: !!currentProvider
    });

    useEffect(() => {
        if (currentProvider) {
            onChangeTerminalFilter("");
            refetchAllTerminalsList();
        }
    }, [currentProvider]);

    useEffect(() => {
        if (!allTerminalsList?.find(terminal => terminal.verbose_name === terminalFilterName)) {
            onChangeTerminalFilter("");
        }
    }, [allTerminalsList]);

    const terminalCommandFilter = (value: string, search: string) => {
        const extendValue = allTerminalsList?.find(terminal => terminal.verbose_name === value)?.verbose_name;
        if (extendValue && extendValue.toLowerCase().includes(search.toLocaleLowerCase())) return 1;
        return 0;
    };

    const onSelectTerminal = (currentValue: string) => {
        onChangeTerminalFilter(currentValue);
        setOpen(false);
    };

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="mt-0" disabled={disabled || isRefetching || isLoading || !isFetched}>
                <Button
                    variant="text_btn"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || isRefetching || isLoading || !isFetched}
                    className="!mt-0 flex h-[38px] w-full min-w-48 flex-1 items-center justify-between rounded-4 border border-neutral-40 bg-neutral-0 bg-white px-3 py-2 text-start text-sm font-normal ring-offset-background hover:!border-green-40 focus:outline-none active:border-green-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-20 disabled:!text-neutral-80 dark:border-neutral-60 dark:bg-neutral-100 disabled:dark:bg-neutral-90 disabled:dark:!text-neutral-60 [&:is([data-state='open'])>#selectToggleIcon]:rotate-180 [&:is([data-state='open'])]:border-green-50 [&>span]:line-clamp-1 [&[data-placeholder]]:text-neutral-60 [&[data-placeholder]]:dark:text-neutral-70">
                    {terminalFilterName ? (
                        <span className="text-neutral-80 focus:!text-neutral-80 active:!text-neutral-80 dark:text-neutral-0">
                            {terminalFilterName}
                        </span>
                    ) : (
                        <span className="text-neutral-70 focus:!text-neutral-70 active:!text-neutral-70">
                            {translate("resources.terminals.filter.filterAllPlaceholder")}
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        <ChevronDown
                            id="selectToggleIcon"
                            className="h-4 w-4 text-green-50 transition-transform dark:text-green-40"
                        />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[70] min-w-[8rem] overflow-hidden rounded-4 border border-green-50 bg-white p-0 shadow-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-neutral-100 md:max-h-[--radix-popover-content-available-height] md:w-[--radix-popover-trigger-width]">
                <Command filter={terminalCommandFilter}>
                    <CommandInput
                        className="cursor-pointer bg-white dark:bg-neutral-100"
                        placeholder={translate("app.ui.actions.search")}
                    />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                value={"null"}
                                className="cursor-pointer bg-white dark:bg-neutral-100"
                                onSelect={() => onSelectTerminal("")}>
                                {translate("resources.transactions.filter.showAll")}
                                <Check
                                    className={cn(
                                        "ml-auto mr-1 h-4 w-4",
                                        terminalFilterName === "" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>

                            {allTerminalsList?.map(terminal => (
                                <CommandItem
                                    key={terminal.id}
                                    value={terminal.verbose_name}
                                    onSelect={onSelectTerminal}
                                    className="cursor-pointer bg-white dark:bg-neutral-100">
                                    {terminal.verbose_name}
                                    <Check
                                        className={cn(
                                            "ml-auto mr-1 h-4 w-4",
                                            terminalFilterName === terminal.verbose_name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
