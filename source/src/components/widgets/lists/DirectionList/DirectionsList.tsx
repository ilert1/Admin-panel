import { ListContextProvider, useInfiniteGetList, useListContext, useListController, useTranslate } from "react-admin";
import { DataTable } from "@/components/widgets/shared";
import { Button } from "@/components/ui/button";
import { UIEvent, useMemo, useState } from "react";
import {} from "react-responsive";
import { Loading, LoadingAlertDialog } from "@/components/ui/loading";

import { useGetDirectionsColumns } from "./Columns";
import { PlusCircle, XIcon } from "lucide-react";
import { ShowSheet } from "./ShowSheet";
import { CreateDirectionDialog } from "./CreateDirectionDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { debounce } from "lodash";

const DirectionListFilter = () => {
    const { filterValues, setFilters, displayedFilters, setPage } = useListContext();
    const {
        data: merchantsData,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage: accountsNextPage
    } = useInfiniteGetList("merchant", {
        pagination: { perPage: 25, page: 1 },
        filter: { sort: "name", asc: "ASC" }
    });

    const translate = useTranslate();

    const [merchantId, setMerchantId] = useState("");
    const accountsLoadingProcess = useMemo(() => isFetchingNextPage && hasNextPage, [isFetchingNextPage, hasNextPage]);

    const onPropertySelected = debounce((value: string, type: "merchant") => {
        if (value) {
            setFilters({ ...filterValues, [type]: value, order_by: "name", asc: true }, displayedFilters);
        } else {
            Reflect.deleteProperty(filterValues, type);
            setFilters(filterValues, displayedFilters);
        }
        setPage(1);
    }, 300);

    const onAccountChanged = (merchant: string) => {
        setMerchantId(merchant);
        onPropertySelected(merchant, "merchant");
    };

    const accountScrollHandler = async (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            accountsNextPage();
        }
    };

    const clearFilters = () => {
        setMerchantId("");
        setFilters({}, displayedFilters);
        setPage(1);
    };

    return (
        <div className="flex flex-col justify-between sm:flex-row sm:items-center md:items-end gap-2 sm:gap-x-4 sm:gap-y-3 flex-wrap">
            <div className="flex flex-1 md:flex-col gap-2 items-center md:items-start min-w-52">
                <span className="md:text-nowrap">{translate("resources.transactions.filter.filterByAccount")}</span>

                <Select
                    onValueChange={val => (val !== "null" ? onAccountChanged(val) : onAccountChanged(""))}
                    value={merchantId}>
                    <SelectTrigger className="text-ellipsis">
                        <SelectValue placeholder={translate("resources.transactions.filter.filterAllPlaceholder")} />
                    </SelectTrigger>

                    <SelectContent align="start" onScrollCapture={accountScrollHandler}>
                        <SelectItem value="null">{translate("resources.transactions.filter.showAll")}</SelectItem>

                        {merchantsData?.pages.map(page => {
                            return page.data.map(merchant => (
                                <SelectItem key={merchant.id} value={merchant.id}>
                                    <p className="truncate max-w-36">{merchant.name}</p>
                                </SelectItem>
                            ));
                        })}

                        {accountsLoadingProcess && (
                            <SelectItem value="null" disabled className="flex max-h-8">
                                <LoadingAlertDialog className="-scale-[.25]" />
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>

            <Button
                className="ml-0 flex items-center gap-1 w-auto h-auto px-0 md:mr-7"
                onClick={clearFilters}
                variant="clearBtn"
                size="default"
                disabled={!merchantId}>
                <span>{translate("resources.transactions.filter.clearFilters")}</span>
                <XIcon className="size-4" />
            </Button>
        </div>
    );
};

export const DirectionsList = () => {
    const listContext = useListController<Directions.Direction>();

    const translate = useTranslate();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { columns, chosenId, quickShowOpen, setQuickShowOpen } = useGetDirectionsColumns();

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-4">
                    <ListContextProvider value={listContext}>
                        <DirectionListFilter />
                    </ListContextProvider>

                    <Button onClick={handleCreateClick} variant="default" className="flex gap-[4px] items-center">
                        <PlusCircle className="h-[16px] w-[16px]" />
                        <span className="text-title-1">{translate("resources.direction.create")}</span>
                    </Button>

                    <CreateDirectionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
                </div>
                <ListContextProvider value={listContext}>
                    <DataTable columns={columns} />
                </ListContextProvider>
                <ShowSheet id={chosenId} open={quickShowOpen} onOpenChange={setQuickShowOpen} />
            </>
        );
    }
};
