import {
    useDataProvider,
    ListContextProvider,
    useListController,
    useTranslate,
    RecordContextProvider
} from "react-admin";
import { useQuery } from "react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/widgets/shared";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, XIcon, Copy, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountShow } from "@/components/widgets/show";
import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import fetchDictionaries from "@/helpers/get-dictionaries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import { Icon } from "../shared/Icon";

export const AccountList = () => {
    const listContext = useListController<Account>();
    // TODO: mock properties for emulating query
    const [mockData, setMockData] = useState(listContext.data as Account[]);
    const [totalSum, setTotalSum] = useState<{ currency: string; amount: number; accuracy: number }[]>();
    const [totalRecords, setTotalRecords] = useState(0);
    // TODO: mock properties for emulating query

    const { isFetching: isFetchingMock } = useQuery({
        queryKey: ["exist"],
        // refetchInterval: 1000,
        enabled: true, //Boolean(blowfishId),
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                const data = {
                    data: [
                        {
                            id: "08bed888-77cd-4a83-ae4c-19cd9d64ddc2",
                            owner_id: "08bed888-77cd-4a83-ae4c-19cd9d64ddc2",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "jkshdvg"
                            },
                            amounts: [],
                            directions: [
                                {
                                    id: "e582808c-ab6b-48f7-a2b0-4c8e8b6db3f6",
                                    keycloak_id: "48f80032-2b40-4bfd-87bd-08f0eedd4979",
                                    name: "jkshdvgShop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "",
                                        sign_key: "",
                                        ballance_key: ""
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "4808ef7c-4daa-489a-88f3-d0f968e4185d",
                            owner_id: "4808ef7c-4daa-489a-88f3-d0f968e4185d",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "7987100021"
                            },
                            amounts: [
                                {
                                    id: "c8fcb401-f17f-4451-9169-eb8dd749585d",
                                    type: "internal",
                                    currency: "USDT",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 2764963207,
                                        accuracy: 100000
                                    }
                                },
                                {
                                    id: "c9fcb401-f17f-4451-9169-eb8dd749585d",
                                    type: "internal",
                                    currency: "USD",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 2764963207,
                                        accuracy: 100000
                                    }
                                }
                            ],
                            directions: [
                                {
                                    id: "62d88a7c-2f90-4f18-9b4c-83822f99c17d",
                                    keycloak_id: "55014482-8efa-4a58-9f60-5ac79e860e89",
                                    name: "7987100021Shop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "6434743a-91be-49d5-bff3-ad2e4be32b9e",
                                        sign_key: "988b484f-d0eb-4565-85d7-12e4cb27c0b5",
                                        ballance_key: "3474abde-2f6e-4214-a6d8-e2785da46ead"
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "RUB",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "a01018ba-6b32-475f-a4d3-2a5790e3afc4",
                            owner_id: "a01018ba-6b32-475f-a4d3-2a5790e3afc4",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "3399799502"
                            },
                            amounts: [
                                {
                                    id: "3c1080f-8086-4aa3-a006-efe060e5320d",
                                    type: "internal",
                                    currency: "USDT",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 3764963207,
                                        accuracy: 100000
                                    }
                                },
                                {
                                    id: "33c1080f-8086-4aa3-a006-efe060e5320d",
                                    type: "internal",
                                    currency: "RUB",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 3764963207,
                                        accuracy: 100000
                                    }
                                }
                            ],
                            directions: [
                                {
                                    id: "187c6394-c966-44f1-b1b1-4919f79e86f2",
                                    keycloak_id: "1d2f48eb-c8d8-4149-972e-dd3117add87a",
                                    name: "3399799502Shop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "6434743a-91be-49d5-bff3-ad2e4be32b9e",
                                        sign_key: "988b484f-d0eb-4565-85d7-12e4cb27c0b5",
                                        ballance_key: "3474abde-2f6e-4214-a6d8-e2785da46ead"
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "RUB",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "02cecee2-f3a3-4db7-91da-fd591352dd6c",
                            owner_id: "02cecee2-f3a3-4db7-91da-fd591352dd6c",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "asdasdasdwd"
                            },
                            amounts: [],
                            directions: [
                                {
                                    id: "5ae786cb-29e7-4419-bc8a-a230b6678e46",
                                    keycloak_id: "9bd76408-8057-4f90-adf1-91fe0ee69fd8",
                                    name: "asdasdasdwdShop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "",
                                        sign_key: "",
                                        ballance_key: ""
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "64054fc4-cacb-41b7-a7fe-dddddb116302",
                            owner_id: "64054fc4-cacb-41b7-a7fe-dddddb116302",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "asdasd"
                            },
                            amounts: [],
                            directions: [
                                {
                                    id: "e9f0e679-e989-490a-84b9-8869b1d5af66",
                                    keycloak_id: "a43a3bd8-f088-4677-ac29-345870f1fdca",
                                    name: "asdasdShop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "",
                                        sign_key: "",
                                        ballance_key: ""
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "3a8b2af9-af82-4ebf-b78c-90879cde4973",
                            owner_id: "3a8b2af9-af82-4ebf-b78c-90879cde4973",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "ttessterrrr"
                            },
                            amounts: [],
                            directions: [
                                {
                                    id: "7bcc25b2-9ee6-4455-b48f-c759cab8d641",
                                    keycloak_id: "a9be8f7b-52ee-46d0-86c5-357a726846d3",
                                    name: "ttessterrrrShop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "",
                                        sign_key: "",
                                        ballance_key: ""
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "82ef14e3-d19c-4c36-abc2-530a4818a03a",
                            owner_id: "82ef14e3-d19c-4c36-abc2-530a4818a03a",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "Name"
                            },
                            amounts: [],
                            directions: [
                                {
                                    id: "ee1c3895-c8a9-4332-8385-47bde13cb875",
                                    keycloak_id: "67da0987-bae7-4253-b49a-ad1f3f6aedd8",
                                    name: "NameShop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "",
                                        sign_key: "",
                                        ballance_key: ""
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "3bf49215-b051-4b42-8a7f-d7488ad6bad0",
                            owner_id: "3bf49215-b051-4b42-8a7f-d7488ad6bad0",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "7924478708"
                            },
                            amounts: [
                                {
                                    id: "57ab117b-55e6-46a7-9e65-838420b88d2a",
                                    type: "internal",
                                    currency: "USDT",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 3764963207,
                                        accuracy: 100000
                                    }
                                }
                            ],
                            directions: [
                                {
                                    id: "26274794-9d26-4219-aa32-b9be083eeeac",
                                    keycloak_id: "9c19ef84-a63a-4be4-9cba-d3f9672f463e",
                                    name: "7924478708Shop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "6434743a-91be-49d5-bff3-ad2e4be32b9e",
                                        sign_key: "988b484f-d0eb-4565-85d7-12e4cb27c0b5",
                                        ballance_key: "3474abde-2f6e-4214-a6d8-e2785da46ead"
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "RUB",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        },
                        {
                            id: "0e81fa9d-899f-4deb-babd-ab6177fe038b",
                            owner_id: "0e81fa9d-899f-4deb-babd-ab6177fe038b",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "Test Taj Account"
                            },
                            amounts: [
                                {
                                    id: "de977f1e-2fd6-4237-818f-d9ed48edbe97",
                                    type: "internal",
                                    currency: "USDT",
                                    shop_currency: "TJS",
                                    value: {
                                        quantity: 181460497,
                                        accuracy: 100000
                                    }
                                }
                            ],
                            directions: [
                                {
                                    id: "f6f699e1-8513-4608-aaac-4b100c698257",
                                    keycloak_id: "",
                                    name: "test-tajikistan-shop",
                                    active: true,
                                    merchant: {
                                        id: "0e81fa9d-899f-4deb-babd-ab6177fe038b",
                                        name: "testaccount",
                                        decription: "test-tajikistan-shop"
                                    },
                                    provider: {
                                        name: "pay4u",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "691dc17c-a66c-423a-9652-4d3d1a5b0140",
                                        sign_key: "96d85e0d-a513-4917-9438-a20c47b56a69",
                                        ballance_key: "f3d0a9f9-bbf0-4336-a38e-d2e7aee0b3da"
                                    },
                                    description: "string",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "string",
                                        position: "before/after"
                                    },
                                    src_currency: {
                                        code: "TJS",
                                        symbol: "string",
                                        position: "before/after"
                                    }
                                }
                            ]
                        },
                        {
                            id: "66d21853-ec08-4e84-a633-e728e06aaea2",
                            owner_id: "66d21853-ec08-4e84-a633-e728e06aaea2",
                            state: 1,
                            type: 1,
                            meta: {
                                caption: "5552585945"
                            },
                            amounts: [
                                {
                                    id: "708c21c6-3dc7-4b56-b216-51ede266205b",
                                    type: "internal",
                                    currency: "USDT",
                                    shop_currency: "RUB",
                                    value: {
                                        quantity: 3764963207,
                                        accuracy: 100000
                                    }
                                }
                            ],
                            directions: [
                                {
                                    id: "589d99bd-67a6-476f-882c-8a84ef5e4791",
                                    keycloak_id: "c89a9d6e-397d-44a8-b717-4011ee1b9716",
                                    name: "5552585945Shop",
                                    active: true,
                                    merchant: {
                                        id: "",
                                        name: "",
                                        decription: ""
                                    },
                                    provider: {
                                        name: "",
                                        schema: ""
                                    },
                                    auth_data: {
                                        api_key: "6434743a-91be-49d5-bff3-ad2e4be32b9e",
                                        sign_key: "988b484f-d0eb-4565-85d7-12e4cb27c0b5",
                                        ballance_key: "3474abde-2f6e-4214-a6d8-e2785da46ead"
                                    },
                                    description: "",
                                    dst_currency: {
                                        code: "USDT",
                                        symbol: "",
                                        position: ""
                                    },
                                    src_currency: {
                                        code: "RUB",
                                        symbol: "",
                                        position: ""
                                    }
                                }
                            ]
                        }
                    ],
                    totalSum: [
                        {
                            currency: "RUB",
                            amount: 78658913250,
                            accuracy: 100000
                        },
                        {
                            currency: "USD",
                            amount: 83475928,
                            accuracy: 100000
                        },
                        {
                            currency: "USDT",
                            amount: 9182350347,
                            accuracy: 100000
                        }
                    ],
                    limit: 10,
                    offset: 0,
                    success: true,
                    total: 10
                };

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        setMockData(data?.data);
                        setTotalSum(data?.totalSum);
                        setTotalRecords(data.total);
                    }
                }

                return data;
            } catch (e: any) {
                console.error(e.response.statusCode);
            }
        }
    });

    const translate = useTranslate();
    const navigate = useNavigate();
    const data = fetchDictionaries();

    const [showOpen, setShowOpen] = useState(false);
    const [showAccountId, setShowAccountId] = useState<string>("");
    const [showAccountCaption, setShowAccountCaption] = useState<string>("");

    const openSheet = (id: string, caption: string) => {
        setShowAccountId(id);
        setShowAccountCaption(caption);
        setShowOpen(true);
    };

    const columns: ColumnDef<Account>[] = [
        {
            id: "owner",
            accessorFn: row => [row.meta.caption, row.owner_id],
            header: translate("resources.accounts.fields.owner"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center gap-1">
                        <span className="text-title-1">{(row.getValue("owner") as Array<string>)[0]}</span>
                        <div className="flex flex-start text-neutral-60 dark:text-neutral-70 items-center gap-2">
                            <Copy
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText((row.getValue("owner") as Array<string>)[1]);
                                    toast.success(translate("app.ui.textField.copied"), {
                                        dismissible: true,
                                        duration: 1000
                                    });
                                }}
                            />

                            <span>{(row.getValue("owner") as Array<string>)[1]}</span>
                        </div>
                    </div>
                </RecordContextProvider>
            )
        },
        {
            id: "state",
            accessorKey: "state",
            header: translate("resources.accounts.fields.state"),
            cell: ({ row }) => data?.accountStates?.[row.getValue("state") as string]?.type_descr || ""
        },
        {
            id: "type",
            accessorKey: "type",
            header: translate("resources.accounts.fields.type"),
            cell: ({ row }) => data?.accountTypes?.[row.getValue("type") as string]?.type_descr || ""
        },
        {
            id: "balance",
            accessorKey: "amounts",
            header: translate("resources.accounts.fields.balance"),
            cell: ({ row }) => (
                <RecordContextProvider value={row.original}>
                    <div className="flex flex-col justify-center">
                        {row.original.amounts.map(item => {
                            return (
                                <div key={item.id}>
                                    <NumericFormat
                                        value={item.value.quantity / item.value.accuracy}
                                        displayType={"text"}
                                        thousandSeparator=" "
                                        decimalSeparator=","
                                    />
                                    {` ${item.currency}`}
                                </div>
                            );
                        })}
                    </div>
                </RecordContextProvider>
            )
        },
        {
            id: "history",
            header: translate("resources.accounts.fields.history"),
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center">
                                <Button variant="secondary" className="h-7 w-7 p-0 bg-transparent">
                                    <EyeIcon className="text-green-50 size-7" />
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(row.original.id, row.original.meta.caption)}>
                                {translate("app.ui.actions.quick_show")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/accounts/${row.original.id}/show`)}>
                                {translate("app.ui.actions.show")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    // TODO: for production uncomment commented condition
    if (isFetchingMock || !listContext.data || !totalRecords) {
        // if (listContext.isLoading || !listContext.data) {
        return <Loading />;
    } else {
        return (
            <>
                {/* TODO: for production should be removed all except listContext*/}
                <ListContextProvider value={{ ...listContext, data: mockData, total: totalRecords }}>
                    <div className="flex gap-6 flex-wrap-reverse items-end">
                        <div className="grow-[1]">
                            <DataTable data={data} columns={columns} />
                        </div>
                        <div className="flex flex-col gap-4 px-6 py-4 rounded-2xl bg-neutral-0 w-[457px] h-fit">
                            <h3 className="text-display-3">{translate("resources.accounts.totalBalance")}</h3>
                            <div className="flex flex-col gap-4 items-end">
                                {totalSum ? (
                                    <>
                                        {totalSum.map(currencySum => {
                                            return (
                                                <div key={currencySum.currency} className="flex gap-4 items-center">
                                                    <h1 className="text-display-1">
                                                        <NumericFormat
                                                            className="whitespace-nowrap"
                                                            value={currencySum.amount / currencySum.accuracy}
                                                            displayType={"text"}
                                                            thousandSeparator=" "
                                                            decimalSeparator=","
                                                        />
                                                    </h1>
                                                    <div className="w-10 flex justify-center">
                                                        <Icon name={currencySum.currency} isCurrency={true} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                </ListContextProvider>
                <Sheet onOpenChange={setShowOpen} open={showOpen}>
                    <SheetContent
                        className="sm:max-w-[1015px] !max-h-[calc(100dvh-84px)] w-full p-0 m-0 top-[84px] flex flex-col"
                        tabIndex={-1}
                        style={{ backgroundColor: "rgba(19, 35, 44, 1)" }}
                        close={false}>
                        <SheetHeader className="p-[42px] pb-[24px] flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center ">
                                    <SheetTitle className="!text-display-1">
                                        {translate("app.ui.accountHistory")}
                                    </SheetTitle>

                                    <button
                                        onClick={() => setShowOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors border-0 outline-0">
                                        <XIcon className="h-[28px] w-[28px]" />
                                    </button>
                                </div>
                                <div className="text-display-2 mb-2">
                                    {/* <TextField text={showAccountCaption} /> */}
                                    <span>{showAccountCaption}</span>
                                </div>
                                <TextField text={showAccountId} copyValue />
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-auto" tabIndex={-1}>
                            <SheetDescription></SheetDescription>
                            <AccountShow id={showAccountId} type="compact" />
                        </div>
                    </SheetContent>
                </Sheet>
            </>
        );
    }
};
