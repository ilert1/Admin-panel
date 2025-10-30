import {
    CreateParams,
    CreateResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetOneParams,
    GetOneResult,
    UpdateParams,
    UpdateResult
} from "react-admin";
import { IBaseDataProvider } from "./base";
import {
    ImportStrategy,
    TerminalPaymentInstrument,
    TerminalPaymentInstrumentBulkDeleteRequest,
    TerminalPaymentInstrumentCreate,
    TerminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentsByTerminalEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdGetSortOrder,
    TerminalPaymentInstrumentFIData
} from "@/api/enigma/blowFishEnigmaAPIService.schemas";
import {
    getTerminalPaymentInstrumentEndpointsExportTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsExportTerminalIdGetUrl,
    terminalPaymentInstrumentEndpointsAddTerminalPaymentInstrumentsByFiEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdFinancialInstitutionFinancialInstitutionCodePost,
    terminalPaymentInstrumentEndpointsBulkDeleteTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsBulkDelete,
    terminalPaymentInstrumentEndpointsCreateTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsPost,
    terminalPaymentInstrumentEndpointsDeleteTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdDelete,
    terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdGet,
    terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentsByTerminalEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdGet,
    terminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsImportPost,
    terminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsMultiCsvEnigmaV1TerminalPaymentInstrumentsImportMultiCsvPost,
    terminalPaymentInstrumentEndpointsInitializeTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdInitializePost,
    terminalPaymentInstrumentEndpointsListProviderPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsProvidersProviderNameGet,
    terminalPaymentInstrumentEndpointsListTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsGet,
    terminalPaymentInstrumentEndpointsPatchTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdPatch
} from "@/api/enigma/terminal-payment-instruments/terminal-payment-instruments";

export class TerminalPaymentInstrumentsProvider extends IBaseDataProvider {
    async getList(resource: string, params: GetListParams): Promise<GetListResult<TerminalPaymentInstrument>> {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(
                  item =>
                      item === "terminal_payment_type_code" ||
                      item === "terminal_currency_code" ||
                      item === "terminal_country" ||
                      item === "terminal_financial_institution_code" ||
                      item === "terminal_financial_institution_outgoing_code" ||
                      item === "system_payment_instrument_code"
              )
            : [];

        let res;
        if (params.filter.terminalFilterId) {
            res =
                await terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentsByTerminalEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdGet(
                    params.filter.terminalFilterId,
                    {
                        currentPage: params?.pagination?.page,
                        pageSize: params?.pagination?.perPage,
                        ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                        ...(fieldsForSearch.length > 0 && {
                            searchString: fieldsForSearch.map(item => params.filter?.[item])
                        }),
                        ...(params.sort?.order && {
                            sortOrder:
                                params.sort.order.toLowerCase() as TerminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentsByTerminalEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdGetSortOrder
                        }),
                        ...(params.sort?.field && { orderBy: params.sort.field.toLowerCase() })
                    },
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        },
                        signal: params.signal || params.filter?.signal
                    }
                );
        } else if (params.filter.provider) {
            res =
                await terminalPaymentInstrumentEndpointsListProviderPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsProvidersProviderNameGet(
                    params.filter.provider,
                    {
                        currentPage: params?.pagination?.page,
                        pageSize: params?.pagination?.perPage,
                        ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                        ...(fieldsForSearch.length > 0 && {
                            searchString: fieldsForSearch.map(item => params.filter?.[item])
                        }),
                        ...(params.sort?.order && {
                            sortOrder:
                                params.sort.order.toLowerCase() as TerminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentsByTerminalEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdGetSortOrder
                        }),
                        ...(params.sort?.field && { orderBy: params.sort.field.toLowerCase() })
                    },
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("access-token")}`
                        },
                        signal: params.signal || params.filter?.signal
                    }
                );
        } else {
            return {
                data: [],
                total: 0
            };
        }

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items,
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: [],
            total: 0
        };
    }

    async getListWithoutPagination(): Promise<GetListResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsListTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsGet(
                {
                    currentPage: 1,
                    pageSize: 10000
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items,
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: [],
            total: 0
        };
    }

    async initialize(terminalId: string, payment_type_codes: string[], currency_codes?: string[]) {
        const res =
            await terminalPaymentInstrumentEndpointsInitializeTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdInitializePost(
                terminalId,
                {
                    payment_type_codes,
                    ...(currency_codes && currency_codes.length > 0 && { currency_codes })
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async getOne(resource: string, params: GetOneParams): Promise<GetOneResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsGetTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdGet(
                params.id,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    },
                    signal: params.signal || params.meta?.signal
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async create(
        resource: string,
        params: CreateParams<TerminalPaymentInstrumentCreate>
    ): Promise<CreateResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsCreateTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsPost(
                params.data as TerminalPaymentInstrumentCreate,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async createByFinancialInstitution(
        resource: string,
        terminalId: string,
        financialInstitutionCode: string,
        params: { data: TerminalPaymentInstrumentFIData }
    ): Promise<GetListResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsAddTerminalPaymentInstrumentsByFiEnigmaV1TerminalPaymentInstrumentsTerminalsTerminalIdFinancialInstitutionFinancialInstitutionCodePost(
                terminalId,
                financialInstitutionCode,
                params.data,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data.items,
                total: res.data.data.total
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async update(resource: string, params: UpdateParams): Promise<UpdateResult<TerminalPaymentInstrument>> {
        const res =
            await terminalPaymentInstrumentEndpointsPatchTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdPatch(
                params.id,
                params.data,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }

    async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
        const res =
            await terminalPaymentInstrumentEndpointsDeleteTerminalPaymentInstrumentEnigmaV1TerminalPaymentInstrumentsTerminalPaymentInstrumentIdDelete(
                params.id,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );

        if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return {
            data: {
                id: params.id
            }
        };
    }

    async uploadReport(file: File, mode: ImportStrategy = "strict", terminal_ids: string[]) {
        const res =
            await terminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsImportPost(
                {
                    csv_file: file,
                    data: JSON.stringify({ terminal_ids })
                },
                {
                    mode
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );
        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }
    }

    // payment_types_csv: Blob;
    // /** JSON string containing terminal_ids array or provider_id */
    // data: string;
    // financial_institutions_csv?: BodyTerminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsMultiCsvEnigmaV1TerminalPaymentInstrumentsImportMultiCsvPostFinancialInstitutionsCsv;
    // currency_csv?: BodyTerminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsMultiCsvEnigmaV1TerminalPaymentInstrumentsImportMultiCsvPostCurrencyCsv;

    async uploadMultipleFiles(files: File[], provider: string, terminal_ids: string[]) {
        const res =
            await terminalPaymentInstrumentEndpointsImportTerminalPaymentInstrumentsMultiCsvEnigmaV1TerminalPaymentInstrumentsImportMultiCsvPost(
                {
                    data:
                        terminal_ids && terminal_ids.length > 0
                            ? JSON.stringify({ terminal_ids })
                            : JSON.stringify({ provider_id: provider }),
                    payment_types_csv: files[0],
                    financial_institutions_csv: files[1],
                    currency_csv: files[2] ? files[2] : undefined
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("access-token")}`
                    }
                }
            );
        if ("data" in res.data && res.data.success) {
            return {
                data: {
                    ...res.data.data
                }
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }
    }

    async downloadReport(terminalId: string, params: GetListParams) {
        const fieldsForSearch = params.filter
            ? Object.keys(params.filter).filter(item => item === "code" || item === "title" || item === "category")
            : [];

        const url =
            getTerminalPaymentInstrumentEndpointsExportTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsExportTerminalIdGetUrl(
                terminalId,
                {
                    ...(fieldsForSearch.length > 0 && { searchField: fieldsForSearch }),
                    ...(fieldsForSearch.length > 0 && {
                        searchString: fieldsForSearch.map(item => params.filter?.[item])
                    })
                }
            );

        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        });
    }

    async bulkDelete(terminalPaymentInstrumentBulkDeleteRequest: TerminalPaymentInstrumentBulkDeleteRequest) {
        const res =
            await terminalPaymentInstrumentEndpointsBulkDeleteTerminalPaymentInstrumentsEnigmaV1TerminalPaymentInstrumentsBulkDelete(
                terminalPaymentInstrumentBulkDeleteRequest,
                {
                    headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` }
                }
            );
        if ("data" in res.data && res.data.success) {
            return {
                data: res.data.data
            };
        } else if ("data" in res.data && !res.data.success) {
            throw new Error(res.data.error?.error_message);
        } else if ("detail" in res.data) {
            throw new Error(res.data.detail?.[0].msg);
        }

        return Promise.reject();
    }
}
