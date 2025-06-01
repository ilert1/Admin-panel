import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingBalance } from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import { TerminalSelectFilter } from "../Terminals/TerminalsListFilter/TerminalSelectFilter";
import useTerminalPaymentInstrumentFilter from "./useTerminalPaymentInstrumentFilter";
import { Button } from "@/components/ui/Button";
import { TerminalPaymentInstrumentsProvider } from "@/data/terminalPaymentInstruments";
import { useAppToast } from "@/components/ui/toast/useAppToast";

interface TerminalPaymentInstrumentFilterProps {
    selectProvider: React.Dispatch<React.SetStateAction<string>>;
    currentProvider: string;
    terminalFilterName: string;
    onChangeTerminalFilter: (terminal: string) => void;
    setTerminalFilterId: (terminal: string) => void;
    total: number;
    termId: string;
}

export const TerminalPaymentInstrumentFilter = ({
    selectProvider,
    currentProvider,
    onChangeTerminalFilter,
    setTerminalFilterId,
    terminalFilterName,
    termId,
    total
}: TerminalPaymentInstrumentFilterProps) => {
    const { providersData, isFetching, providersLoadingProcess, onProviderChanged, translate, providerScrollHandler } =
        useTerminalPaymentInstrumentFilter({ selectProvider });

    const terminalsDataProvider = new TerminalPaymentInstrumentsProvider();
    const appToast = useAppToast();

    const handleInit = async () => {
        try {
            await terminalsDataProvider.initialize(termId, []);
            appToast("success", "");
        } catch (error) {
            if (error instanceof Error) {
                appToast("error", error.message);
            }
        }
    };
    return (
        <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-3 md:flex-row md:items-end">
            <div className="md: flex min-w-36 flex-1 flex-col gap-1 sm:max-w-96 md:max-w-60">
                <Label className="mb-0" variant="title-2">
                    {translate("resources.terminals.selectHeader")}
                </Label>

                <Select onValueChange={onProviderChanged} value={currentProvider}>
                    <SelectTrigger className="text-ellipsis">
                        <SelectValue placeholder={translate("resources.terminals.selectPlaceholder")} />
                    </SelectTrigger>

                    <SelectContent align="start" onScrollCapture={providerScrollHandler}>
                        {providersData?.pages.map(page => {
                            return page.data.map(provider => (
                                <SelectItem key={provider.name} value={provider.name}>
                                    <p className="max-w-36 truncate">{provider.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {(providersLoadingProcess || (!providersLoadingProcess && isFetching && !providersData)) && (
                            <SelectItem value="null" disabled className="h-8">
                                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                                    <LoadingBalance className="h-[20px] w-[20px] overflow-hidden" />
                                </div>
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-grow-100 flex min-w-[150px] flex-1 flex-col gap-1 sm:max-w-96 md:max-w-[400px]">
                <Label variant="title-2" className="mb-0 md:text-nowrap">
                    {translate("resources.terminals.filter.filterByName")}
                </Label>

                <TerminalSelectFilter
                    currentProvider={currentProvider}
                    onChangeTerminalFilter={onChangeTerminalFilter}
                    terminalFilterName={terminalFilterName}
                    disabled={providersLoadingProcess || (!providersLoadingProcess && isFetching && !providersData)}
                    setTerminalFilterId={setTerminalFilterId}
                />
            </div>
            <div className="">
                <Button
                    onClick={handleInit}
                    disabled={!(Boolean(currentProvider) && Boolean(terminalFilterName)) || !total}>
                    {translate("resources.paymentTools.terminalPaymentInstruments.initInstruments")}
                </Button>
            </div>
        </div>
    );
};
